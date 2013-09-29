(function(scene) {
   
   // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      console.log('temple-1 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.y <= 0) {
         scene.parent.show('temple-2');
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
      var kind ='';
      var style = 'top: ' + (skyHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;';
      // if (['5-5', '3-8', '2-4'].indexOf(x+'-'+y) !== -1) {
      if (x === 1 && y%2==0) {
         kind = 'npc knight right talkable';
         // add some random left or right
      } else if (x === 10 && y%2==0) {
         kind = 'npc knight left talkable';
         // add some knights
      } else if (['3-3', '8-5'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items dummy attackable';
      } else if (['2-3'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc knight right talkable';
      } else if (['4-3', '9-5'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc knight left talkable';
      } else if (x === 0 || x === 11) {
         kind = 'obstacle';
      } else if ((x >= 2 || x <= 9) && y === 0) {
         kind = 'items arrow up';
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
