(function(scene) {
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      //console.log('war-2 checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.x === 0 && playerMovState.level === 2) {
         // check if player has found the holy table cloth
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
      
      if (y === 0 || y === 8) {
            kind = 'obstacle items wall';
      } else if (['3-1', '3-7', '5-4'].indexOf(x+'-'+y) !== -1) {
         // var tempIndex = y*x%2;
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin1';
      } else if (['8-1', '8-7', '6-3'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin2';
      } else if (['10-3', '10-5', '4-1', '4-7','5-3', '6-4', '7-1', '7-7', '11-4'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle items ruin3';
      } else if (['10-4'].indexOf(x+'-'+y) !== -1) {
         // kind = kindArr[tempIndex];
         kind = 'obstacle talkable items socket tablecloth';
      } else if (x === 0) {
         // without left class
         kind = 'arrow left';
      } else if (['4-3','4-4','9-3', '9-4', '9-5'].indexOf(x+'-'+y) !== -1) {
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

