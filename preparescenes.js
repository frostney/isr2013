var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var sourcemap = require('source-map');
var SourceNode = sourcemap.SourceNode;
var SourceMapGenerator = sourcemap.SourceMapGenerator;
var SourceMapConsumer = sourcemap.SourceMapConsumer;

// Using esprima might be overkill, but maybe I could use it for other stuff?
var esprima = require('esprima');

// TODO: Make this available for prefabs as well

var defaultSceneTemplate = "{{#if gameobject}}\n  {{#each gameobject}}\n    <div id=\"{{name}}\">{{{content}}}</div>\n  {{/each}}\n{{/if}}\n\n{{#if prefab}}\n  {{#each prefab}}\n    <div id=\"{{name}}\">{{{content}}}</div>\n  {{/each}}\n{{/if}}\n\n{{#if guilayer}}\n  {{{guilayer.content}}}\n{{/if}}";

module.exports = function(namespace, scenePath, output, callback) {

  var sceneObject = 'define("' + namespace + '/scenelist", ["lyria/scene", "lyria/template/engine"], function(Scene, TemplateEngine) {\n';
  sceneObject += '\tvar sceneList = {};\n';

  var sceneList = fs.readdirSync(scenePath);
  
  var sceneLines = 2;
  
  // source map file of input
  var sourceMaps = [];

  var sourceNode = new SourceNode();

  sceneList.forEach(function(scene) {
    // skip scenes with leading dot
    if (scene.indexOf('.') === 0) {
      return;
    }
    
    if (path.extname(scene) === '') {
      if (fs.existsSync(path.join(scenePath, scene))) {

        var sceneFunc = path.join(scenePath, scene, 'scene.js');
        var sceneFuncContent = fs.existsSync(sceneFunc) ? fs.readFileSync(sceneFunc, 'utf8') : null;
        var sceneLoc = path.join(scenePath, scene, 'localization.json');
        var sceneMarkup = path.join(scenePath, scene, 'scene.html');
        var scenePartials = path.join(scenePath, scene, 'partials');

        var parsedSceneFunc = {};

        var sceneDeps = '[]';
        var options = '{}';

        if (sceneFuncContent != null) {
          parsedSceneFunc = esprima.parse(sceneFuncContent, {
            comment: true
          });

          var commentArray = parsedSceneFunc.comments;

          if (commentArray != null && Array.isArray(commentArray) && commentArray.length > 0) {

            for (var i = 0, j = commentArray.length; i < j; i++) {

              (function(comment) {
                if ((comment.type == null && comment.value == null) || comment.type !== 'Block') {
                  return;
                }

                var value = comment.value;

                if (value.indexOf(':') > 0) {
                  var splitted = value.split(':');

                  var name = splitted[0];
                  var data = splitted[1];

                  switch(name) {
                    case 'depends':
                      sceneDeps = data;
                      break;

                    case 'options':
                      options = data;

                    default:
                      break;
                  }
                }
              })(commentArray[i]);
            }
          }
        } else {
           console.error('missing scene.js file in ' + scenePath + '/' +scene);
           sceneFuncContent = '""';
        }

        sceneObject[scene] = {};

        sceneObject += '\tsceneList["' + scene + '"] = new Scene("' + scene + '", ' + sceneDeps + ', function() {\n';

        var sceneLocLines = 0;
        if (fs.existsSync(sceneLoc)) {
          try {
            var sceneLocContent = fs.readFileSync(sceneLoc, 'utf8');
            sceneObject += '\t\tthis.localization = ' + sceneLocContent + ';\n';
            sceneLocLines = sceneLocContent.split('\n').length + 1;
          } catch (e) {
            console.log('Error while evaluating ' + sceneLoc + ' :' + e);
          }
        }
        sceneLines += sceneLocLines;

        if (fs.existsSync(scenePartials)) {
          var partialsList = fs.readdirSync(scenePartials);

          partialsList.forEach(function(partial) {

          });
        }

        sceneObject += '\t\tthis.template = this.template || {};\n\t\tvar self = this\n;';
        sceneObject += '\t\tthis.template.helpers["translate"] = this.t;';

        var precompiledMarkup = 'void 0';
        var precompiledMarkupLines = 0;
        if (fs.existsSync(sceneMarkup)) {
          precompiledMarkup = handlebars.precompile(fs.readFileSync(sceneMarkup, 'utf8') + '\n' + defaultSceneTemplate);
        } else {
          precompiledMarkup = handlebars.precompile(defaultSceneTemplate);
        }
        precompiledMarkupLines = precompiledMarkup.split('\n').length;
        sceneLines += precompiledMarkupLines;
        
        sceneObject += '\t\tthis.template.source = TemplateEngine.compile(' + precompiledMarkup + ', {partials: self.template.partials, helpers: self.template.helpers});\n';

        var childNodeChunks = sceneFuncContent.split('\n');
        for ( j = 0, m = childNodeChunks.length - 1; j < m; j++) {
          childNodeChunks[j] += '\n';
        }

        childNodeChunks.map(function(line) {
          if (/\/\/@\s+sourceMappingURL=(.+)/.test(line)) {
            var sourceMapPath = filename.replace(/[^\/]*$/, RegExp.$1);
            var sourceMap = grunt.file.readJSON(sourceMapPath);
            sourceMap.file = filename;
            var sourceRoot = path.resolve(path.dirname(filename), sourceMap.sourceRoot);
            sourceMap.sources = sourceMap.sources.map(function(source) {
              return path.relative(process.cwd(), path.join(sourceRoot, source));
            });
            delete sourceMap.sourceRoot;
            sourceMaps.push(sourceMap);
            return line.replace(/@\s+sourceMappingURL=[\w\.]+/, '');
          }
          return line;
        }).forEach(function(line, j) {
          //console.log('line ' + (j + 1 + sceneLines) + ': ' + line);
          //sourceNode.add(new SourceNode(j + 2 + sceneLines, 0, scene + '/' + 'scene.js', line));
          sourceNode.add(new SourceNode(j + 1, 0, scene + '/' + 'scene.js', line));
        });
        sourceNode.setSourceContent(scene + '/' + 'scene.js', sceneFuncContent);
        

        if (sceneFuncContent != null) {
          sceneObject += '\t\tvar sceneFunc = ' + sceneFuncContent + ';\n';
          sceneObject += '\t\tif (typeof sceneFunc === "function") { sceneFunc = sceneFunc.apply(this, arguments); }';
          sceneObject += '\t\treturn sceneFunc;';
        }

        sceneObject += '\t});\n';
      }
    }

  });

  sceneObject += '\treturn sceneList;\n';

  sceneObject += '});\n';
  
  sceneObject += '//@ sourceMappingURL=scenelist.js.map';

  fs.writeFile(output, sceneObject, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
    
    var code_map = sourceNode.toStringWithSourceMap({
      file: output,
      sourceRoot: '/assets/scenes'
    });

    // Write the source map file.
    var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(code_map.map.toJSON()));
    sourceMaps.forEach(function(sourceMap){
      generator.applySourceMap(new SourceMapConsumer(sourceMap));
    });
    var newSourceMap = generator.toJSON();
    newSourceMap.file = path.basename(newSourceMap.file);
    
    fs.writeFileSync(output + '.map', JSON.stringify(newSourceMap, null, '  '));

    if (callback) {
      callback();
    }
  });
}; 