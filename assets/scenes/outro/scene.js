(function(scene) {

  var messageArray = ['Johannes Stein', 'Dawid Pach', 'Claudiu Coman', 'This game was developed as part of Indie Speed Run 2013 (<a href="http://www.indiespeedrun.com">www.indiespeedrun.com</a>).']

  scene.expose({
    message: messageArray
  });

   scene.events = {
     '.continue': {
       click: function() {
         window.location.reload();
       }
     }
   };

})(this);
