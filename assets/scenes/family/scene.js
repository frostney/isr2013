(function(scene) {
   
   var tile = [];

   var skyHeight = 0;
   var screenWidth = 960;
   var screenHeight = 720;
   var tileWidth = 80;
   var tileHeight = 80;

   for (var i = 0; i < screenHeight / tileHeight; i++) {
      for (var j = 0; j < (screenWidth / tileWidth); j++) {
         var style = 'top: ' + (skyHeight + (tileWidth * i)) + 'px; left: ' + (tileHeight * j) + 'px;background-color:rgb(' + ((i + j) * 20) + ',' + ((i + j) * 15) + ',100)';

         tile.push({
            id : 'x' + i + '-y' + j,
            style : style
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
