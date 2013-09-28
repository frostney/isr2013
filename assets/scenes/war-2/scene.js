(function(scene) {
   
  console.log(scene.modules);
  var Config = scene.modules.ISR.Config;
  // console.log(Config);
  var tile = [];
  
  var skyHeight = 0; 
  var tileWidth = Config.tile.width; 
  var tileHeight = Config.tile.height; 
  var tileLimitX = Config.tilesLimit.x; //12
  var tileLimitY = Config.tilesLimit.y; 
  
  // for (var i = 0; i < 9; i++) {
  for (var i = 0; i < tileLimitY; i++) {
    for (var j = 0; j < (tileLimitX); j++) {
      var style = 'top: ' + (skyHeight +(tileWidth * i)) + 'px; left: '+ (tileHeight * j) + 'px;background-color:rgb('+((i+j)*10)+','+((i+j)*15)+',250)';

      tile.push({
        id: 'x' + i + '-y' + j,
        style: style
      });
    }
  }

  scene.expose({
    title: scene.t('title', {
      'name': scene.name
      }),
    tile: tile
  });
  
})(this);
