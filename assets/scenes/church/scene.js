(function(scene, Lyria) {

   // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState) {
      console.log('church checking if we need to change the scene');
      if (playerMovState.y <= 8) {
         scene.parent.show('temple-1');
      } else if (playerMovState.y <= 6) {
         scene.parent.show('war-1');
      } else if (playerMovState.y <= 4) {
         scene.parent.show('family');
      } else if (playerMovState.y <= 2) {
         alert('You´ve got your pennance');
      }
   });
  console.log(scene.modules);
  var Config = scene.modules.ISR.Config;
  console.log(Config);
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
      var style = 'top: ' + (skyHeight +(tileWidth * y)) + 'px; left: '+ (tileHeight * x) + 'px;background-color:rgb('+((x+y)*10)+','+((x+y)*15)+',100)';
      
         console.log('before loop');
      if ((x < 5 || x> 7) && ((y*x)%12 == 3)) {
         console.log('here in loop');
         kind = 'obstacle grave';
      } else if (x > 4 && x< 8){
         kind = 'road';
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
