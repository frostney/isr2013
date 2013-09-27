module.exports = function(grunt) {

  var fs = require('fs');
  var bower = require('bower');
  require('es6-shim');
  var mime = require('mime');
  var path = require('path');

  var pkgFile = require('./package.json');
  var lyriaConfig = pkgFile.lyriaProject || {};

  var buildPrefix = 'builds';
  var buildVersion = pkgFile.version + '-' + grunt.template.today("yymmdd-HHMMss");
  var buildId = pkgFile.name + '-v' + buildVersion;
  var buildFolder = [buildPrefix, buildId].join('/');

  var libFiles = (fs.existsSync('./lib')) ? fs.readdirSync('./lib') : [];
  var styleFiles = (fs.existsSync('./css')) ? fs.readdirSync('./css') : [];

  var libFilesPriorities = ['almond', 'handlebars', 'fastclick', 'udefine'];

  var templateScripts = {
    development: [],
    production: []
  };
  var templateStyles = [];

  var uglifyLibObject = {};

  for (var i = 0, j = libFiles.length; i < j; i++) {
    (function(iterator) {
      uglifyLibObject[path.join(buildFolder, 'lib', iterator)] = path.join('./lib', iterator);
      if (libFilesPriorities.indexOf(iterator) >= 0) {
        templateScripts.unshift('lib/' + iterator);
      } else {
        templateScripts.push('lib/' + iterator);
      }
    })(libFiles[i]);
  }

  uglifyLibObject[buildFolder + '/js/<%= pkg.name %>.js'] = '<%= concat_sourcemap.dist.dest %>';
  //templateScripts.push('js/<%= pkg.name %>.js');

  for (var k = 0, l = styleFiles.length; k < l; k++) {
    (function(iterator) {
      templateStyles.push('css/' + iterator);
    })(styleFiles[k]);
  }

  grunt.initConfig({
    pkg: pkgFile,
    lyriaConfig: lyriaConfig,
    buildVersion: buildVersion,
    buildFolder: buildFolder,
    concat_sourcemap: {
      options: {
        sourcesContent: true,
        sourceRoot: '/'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'js/<%= pkg.name %>.js'
      }
    },
    copy: {
      production: {
        files: [{
          expand: true,
          src: ['assets/**'],
          dest: '<%= buildFolder %>/',
          filter: function(filepath) {
            if ((filepath.indexOf('/scenes') >= 0) || (filepath.indexOf('/prefabs') >= 0)) {
              return false;
            } else {
              return true;
            }
          }
        }, {
          expand: true,
          src: ['css/**'],
          dest: '<%= buildFolder %>/'
        }, {
          expand: true,
          src: ['favicon.ico'],
          dest: '<%= buildFolder %>/'
        }, {
          expand: true,
          src: ['*.png'],
          dest: '<%= buildFolder %>/'
        }]
      }
    },
    template: {
      development: {
        src: 'template.html',
        dest: 'index.html',
        engine: 'handlebars',
        variables: {
          livereload: true,
          scripts: templateScripts.development,
          styles: templateStyles,
          mainModule: pkgFile.name,
          title: '<%= lyriaConfig.title %> (Development build <%= buildVersion %>)',
          description: lyriaConfig.description,
          author: lyriaConfig.author
        }
      },
      production: {
        src: 'template.html',
        dest: '<%= buildFolder %>/index.html',
        engine: 'handlebars',
        variables: {
          livereload: false,
          scripts: templateScripts.production,
          styles: templateStyles,
          mainModule: pkgFile.name,
          title: lyriaConfig.title,
          description: lyriaConfig.description,
          author: lyriaConfig.author
        }
      }
    },
    uglify: {
      production: {
        files: uglifyLibObject
      }
    },
    compress: {
      deploy: {
        options: {
          archive: '<%= buildFolder %>.zip'
        },
        files: [{
          cwd: '<%= buildFolder %>/',
          src: ['**'],
          dest: '<%= pkg.name %>/'
        }]
      }
    },
    stylus: {
      options: {
        paths: ['stylus'],
        urlfunc: 'embedurl',
        import: ['nib'],
      },
      development: {
        options: {
          compress: false,
          linenos: true
        },
        files: {
          'css/<%= pkg.name %>.css': 'stylus/**/*.styl'
        }
      },
      production: {
        options: {
          compress: true
        },
        files: {
          '<%= buildFolder %>/css/<%= pkg.name %>.css': 'stylus/**/*.styl'
        }
      }
    },
    csslint: {
      lint: {
        src: ['css/mygame.css']
      }
    },
    jshint: {
      assets: {
        src: ['assets/**/*.js']
      },
      source: {
        src: ['src/**/*.js', '!src/generated/**/*.js']
      }
    },
    watch: {
      options: {
        // Start a live reload server on the default port 35729
        livereload: true,
      },
      stylus: {
        files: 'stylus/**/*.styl',
        tasks: ['stylus']
      },
      prepare: {
        files: 'assets/**/*',
        tasks: ['prepare']
      },
      template: {
        files: 'template.html',
        tasks: ['template:development']
      },
      concat: {
        files: 'src/**/*.js',
        tasks: ['concat_sourcemap']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var prepareScenes = require('./preparescenes');

  grunt.registerMultiTask('assetArray', 'Updated asset array', function() {
    var files = this.filesSrc;
    
    for (var i = 0, j = files.length; i < j; i++) {
      (function(file) {
        
      })(files[i]);
    }
  });

  grunt.registerTask('prepare', 'Updates asset array and prepares scenes', function() {
    var done = this.async();
    var dir = './';
    var projectName = pkgFile.name;
    var assetObject = {};

    grunt.file.recurse(path.join(dir, 'assets'), function(abspath, rootdir, subdir, filename) {
      var stat;
      var dirname;

      if (subdir == null) {
        subdir = '';
      }

      if ((filename.toLowerCase().indexOf('readme') >= 0) || (subdir.indexOf('scenes') >= 0) || (subdir.indexOf('prefabs') >= 0) || (subdir.indexOf('gameobjects') >= 0) || (filename.indexOf('.') === 0)) {
        return;
      }

      if (!subdir) {
        dirname = 'root';
      } else {
        dirname = subdir;
      }

      assetObject[dirname] = assetObject[subdir] || {};
      stat = fs.statSync(abspath);
      assetObject[dirname].files = assetObject[dirname].files || [];
      assetObject[dirname].files.push({
        name: abspath,
        type: mime.lookup(abspath),
        size: stat.size
      });
      if (assetObject[dirname].totalSize) {
        assetObject[dirname].totalSize += stat.size;
      } else {
        assetObject[dirname].totalSize = stat.size;
      }
    });

    var assetSize = 0;
    var value;
    for (var key in assetObject) {
      value = assetObject[key];

      assetSize += value.totalSize;
    }

    assetObject.totalSize = assetSize;

    grunt.file.write(path.join(dir, 'src', 'generated', 'assetlist.js'), 'define("' + projectName + '/assetlist",' + JSON.stringify(assetObject) + ');');

    prepareScenes(projectName, path.join(dir, 'assets', 'scenes'), path.join(dir, 'src', 'generated', 'scenelist.js'), function() {
      grunt.log.writeln('Project built');
      done();
    });
  });

  grunt.registerTask('bower', 'Prepares scripts using bower components', function() {
    var done = this.async();

    bower.commands.list({
      paths: true
    }).on('end', function(results) {
      for (var key in results) {
        var val = results[key];

        if (val.indexOf(',') >= 0) {
          val = val.split(',');
        }

        var value = '';
        if (Array.isArray(val)) {
          if (key === 'handlebars') {
            value = val[1];
          }

          for (var i = 0, j = val.length; i < j; i++) {
            if ((path.extname(val[i]) === '.js') && !val[i].endsWith('.min.js')) {
              value = val[i];
              break;
            }
          }
        } else {
          value = val;
        }
        var value = path.relative(process.cwd(), value);

        if (!value.endsWith('.css')) {

          if (!value.endsWith('.js')) {
            value += path.sep + key + '.js';
          }

          if (libFilesPriorities.indexOf(key) >= 0) {
            templateScripts.development.unshift(value);
          } else {
            templateScripts.development.push(value);
          }

        }

      }

      templateScripts.development.push('js/<%= pkg.name %>.js');

      grunt.task.run('template:development');
      done();
    });
  });

  grunt.registerTask('prebuild', 'Task before building the project', ['prepare', 'concat_sourcemap', 'bower']);
  grunt.registerTask('test', 'Lints JavaScript and CSS files', ['jshint']);

  grunt.registerTask('development', 'Development build', ['prebuild', 'stylus:development']);
  grunt.registerTask('production', 'Production build', ['prebuild', 'uglify', 'copy', 'stylus:production', 'template:production']);
  grunt.registerTask('deploy', 'Deploys project', ['production', 'compress:deploy']);

  grunt.registerTask('build', 'Builds the default project', ['development']);
  grunt.registerTask('default', 'Default task', ['development']);

};