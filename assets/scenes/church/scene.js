(function(scene, Lyria) {
/*
  scene.events = {
    '#btnSwitch': {
      'click': function(event) {
        scene.parent.show('scene2');
      }
    }
  };
*/

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

    $('body').keyup(function(e) {
      var charPos = $('#character').offset();
      
      var up = ~~((e.keyCode === 87) || (e.keyCode === 38)); // W || Arrow up
      var down = ~~((e.keyCode === 83) || (e.keyCode === 40)); // S || Arrow down
      var left = ~~((e.keyCode === 65) || (e.keyCode === 37)); // A || Arrow left
      var right = ~~((e.keyCode === 68) || (e.keyCode === 39)); // D || Arrow right  
      
      var direction;
      
      if (up) {
        direction = 'up';
      } else if (down) {
        direction = 'down';
      } else if (left) {
        direction = 'left';
      } else if (right) {
        direction = 'right';
      }
      
      var newPos = {
        left: charPos.left,
        top: charPos.top
      };

      // todo movement
      
    });
  scene.expose({
    title: scene.t('title', {
      'name': scene.name
      }),
    tile: tile
  });
  
  console.log(scene);
  console.log(scene.game);
  scene.log('yeeha!');

})(this, arguments[1]);
