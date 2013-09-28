(function(scene) {
  // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      console.log('temple-2 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.level === 3) {
         scene.parent.show('church');
      }
   });
   
  var Config = scene.modules.ISR.Config;
  // console.log(Config);
  var tile = [];
  
  var skyHeight = 0; 
  var tileWidth = Config.tile.width; 
  var tileHeight = Config.tile.height; 
  var tileLimitX = Config.tilesLimit.x; //12
  var tileLimitY = Config.tilesLimit.y; 
  
  // for (var x = 0; x < 12; x++) {
    for (var x= 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
      var style = 'top: ' + (skyHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;';
      
      tile.push({
        id: 'x' + x + '-y' + y,
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
