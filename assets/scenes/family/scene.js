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
  var family = [];
  
  var skyHeight = 0; 
  var tileWidth = Config.tile.width; 
  var tileHeight = Config.tile.height; 
  var tileLimitX = Config.tilesLimit.x; //12
  var tileLimitY = Config.tilesLimit.y; 
  
    for (var x= 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
      var kind ='';
      var style = 'top: ' + (tileWidth * y) + 'px; left: '+ (tileHeight * x) + 'px;';
      
      if (['2-5'].indexOf(x+'-'+y) !== -1) {
         // var tempIndex = y*x%2;
         // kind = kindArr[tempIndex];
         kind = 'obstacle items bed';
         
      } else if (['6-5'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items chair';
         
      } else if (['5-6'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items table';
      } else if (['6-6'].indexOf(x+'-'+y) !== -1) {
         family.push({
           'data-x': x,
           'data-y': y,
           style: style,
           member: 'wife'
         });
      } else if (['5-5'].indexOf(x+'-'+y) !== -1) {
         family.push({
           'data-x': x,
           'data-y': y,
           style: style,
           member: 'child'
         });
      } else if (['4-6'].indexOf(x+'-'+y) !== -1) {
         family.push({
           'data-x': x,
           'data-y': y,
           style: style,
           member: 'brother'
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
    family: family
  });
  
})(this);
