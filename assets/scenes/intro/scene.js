(function(scene) {

  var messageArray = ['The crusade is a lie', 'Repent your sins, templar', 'Why did they all have to die?']

  scene.expose({
    messages: messageArray
  });

   scene.events = {
     '.continue': {
       click: function() {
         scene.parent.show('church');
       }
     }
   };

})(this);
