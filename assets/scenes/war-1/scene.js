(function(scene) {
   // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      console.log('war-1 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.x === 11 && playerMovState.level === 1) {
         scene.parent.show('war-2');
      } else if (playerMovState.x === 0 && playerMovState.level === 2) {
      // check if player has found the holy table cloth
         scene.parent.show('church');
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
      
      if (['3-2', '3-6'].indexOf(x+'-'+y) !== -1) {
         // var tempIndex = y*x%2;
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin1';
         
      } else if (['9-2', '9-6'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin2';
         
      } else if (['4-1', '4-5', '8-1', '8-5'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin3';
      } else if (['1-2'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items sign';
         
      } else if (['10-3', '10-4', '10-5'].indexOf(x+'-'+y) !== -1) {
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
