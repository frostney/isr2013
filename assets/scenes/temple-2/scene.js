(function(scene) {
  // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      //console.log('temple-2 checking if we need to change the scene, current '+scene.parent.currentScene.name);
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
      var style = 'top: ' + (skyHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;';
      // set master templar
      if (x === 5 && y === 5) {
         kind = 'npc knight old talkable';
      } // set idle templars
        else if (['3-5','4-4', '5-4'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc knight right';
           
      } else if (['6-4', '7-4', '8-5'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc knight left';
         // TODO add some random left or right
      } else if (x === 7 && y === 7) {
         kind = 'npc brother';
      } else if (x === 8 && y === 7) {
         kind = 'npc wife';
      } else if (x === 9 && y === 7) {
         kind = 'npc child';
      } else if (y <= 3 || x <= 1 || x >= 10 || ['9-4', '8-4', '9-5', '2-4', '2-5', '3-5'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle';
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
