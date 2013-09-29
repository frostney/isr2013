(function(scene, Lyria) {

   // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      var showScene = function(sceneName) {
         scene.$element.addClass('scalerotate');
         scene.$element.on('transitionend', function() {
           scene.parent.show(sceneName);
           scene.$element.removeClass('scalerotate');
         });
      };
     
      if (sceneName !== scene.name) {
         return;
      }
      //console.log('church checking if we need to change the scene, current '+scene.parent.currentScene.name);
      if (playerMovState.y === 7 && playerMovState.level === 0) {
         showScene('temple-1');
      } else if (playerMovState.y === 6 && playerMovState.level === 1) {
         showScene('war-1');
      } else if (playerMovState.y === 5 && playerMovState.level === 2) {
         showScene('family');
      } else if (playerMovState.y === 4 && playerMovState.level === 3) {
         alert('You´ve got your pennance');
      }
   });
  var Config = scene.modules.ISR.Config;
  console.log(Config);
  var tile = [];
  
  var churchHeight = 0; 
  var tileWidth = Config.tile.width; 
  var tileHeight = Config.tile.height; 
  var tileLimitX = Config.tilesLimit.x; //12
  var tileLimitY = Config.tilesLimit.y; 
  
  // for (var x = 0; x < 12; x++) {
    for (var x= 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
      var kind ='';
      var style = 'top: ' + (churchHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;';
      if (x > 4 && x < 8 && y > 3){
         kind = 'items road';
      } else if (['1-1','1-4','2-1', '2-4', '3-1', '3-4','10-1'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items grave1';
      } else if (['2-2', '2-5', '3-2', '3-5', '11-1'].indexOf(x+'-'+y) !== -1) {
         kind = 'obstacle items grave2';
         // TODO add some random left or right
      } else {
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

})(this, arguments[1]);
