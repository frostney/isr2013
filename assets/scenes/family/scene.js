(function(scene) {
  // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      //console.log('family checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.x === 8 && playerMovState.y === 4 && playerMovState.level === 3) {
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
      
      if (y < 4 || (y===4 && x !== 8)) { 
         kind = 'obstacle';
      } else if (['10-8','11-8'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items bed';
      } else if (['3-5', '11-6', '4-6'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items chair';
      } else if (['3-6'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items table';
      } else if (['0-6'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items dummy';
      } else if (['6-6'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc wife talkable';
      } else if (['10-7'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc brother';
      } else if (['0-5'].indexOf(x+'-'+y) !== -1) {
         kind = 'npc child';
      } else if (['8-4'].indexOf(x+'-'+y) !== -1) {
         kind = 'arrow up';
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
