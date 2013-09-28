(function(scene) {
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      console.log('war-2 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.x === 0 && false) {
         // TODO add check if player has found the holy table cloth
         scene.parent.show('war-1');
      }
   });
  
  console.log(scene.modules);

  var Config = scene.modules.ISR.Config;
  // console.log(Config);
  var tile = [];
  var enemy = [];
  // var kindArr = ['obstacle wall', 'obstacle ruin'];
  
  var skyHeight = 0; 
  var tileWidth = Config.tile.width; 
  var tileHeight = Config.tile.height; 
  var tileLimitX = Config.tilesLimit.x; //12
  var tileLimitY = Config.tilesLimit.y; 
  
    for (var x= 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
      var kind ='';
      var style = 'top: ' + (tileWidth * y) + 'px; left: '+ (tileHeight * x) + 'px;';
      
      if (['6-2', '3-4', '9-2'].indexOf(x+'-'+y) !== -1) {
         // var tempIndex = y*x%2;
         // kind = kindArr[tempIndex];
         kind = 'obstacle ruin1';
      } else if (['9-6', '3-7', '10-5'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle ruin2';
      } else if (['5-7', '3-1', '7-4'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle ruin3';
      } else if (['6-6', '7-8', '3-5'].indexOf(x+'-'+y) !== -1) {
         // add enemies
         enemy.push({
           'data-x': x,
           'data-y': y,
           style: style
         });
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
    tile: tile,
    enemy: enemy
  });
  
})(this);

