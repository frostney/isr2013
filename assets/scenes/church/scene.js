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
      name: scene.name
    })
  });
  
  console.log(scene);
  console.log(scene.game);
  scene.log('yeeha!');

})(this, arguments[1]);
