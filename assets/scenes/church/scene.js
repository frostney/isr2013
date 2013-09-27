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
  scene.expose({
    title: scene.t('title', {
      name: scene.name
    })
  });
  
  console.log(scene);
  console.log(scene.game);
  scene.log('yeeha!');

})(this, arguments[1]);
