(function(scene) {
  // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      console.log('temple-2 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.level >= 1) {
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
  
  // for (var i = 0; i < 9; i++) {
  // for (var x = 0; x < 12; x++) {
    for (var x= 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
      var kind ='';
      var style = 'top: ' + (skyHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;background-color:rgb('+((x+y)*10)+','+((x+y)*15)+',100)';
      // set master templar
      if (x === 5 && y === 2) {
         kind = 'npc knight old';
      } // set idle templars
      else if (['5-5', '3-8', '2-4'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc knight left';
         // TODO add some random left or right
      } else if (x === 7 && y === 3) {
         kind = 'npc brother';
      } else if (x === 8 && y === 3) {
         kind = 'npc wife';
      } else if (x === 9 && y === 3) {
         kind = 'npc child';
      }
      tile.push({
        id: 'x' + x + '-y' + y,
        style: style,
        kind: kind
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
