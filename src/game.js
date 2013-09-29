define('isr', ['lyria/game', 'isr/scenelist', 'isr/assetlist', 'lyria/audio', 'jquery'], function(Game, sceneList, assetList, Audio, $) {'use strict';

   // Create a new game object
   var myGame = new Game();

   // Set generated scene files
   myGame.director.scenes = sceneList;

   // If preloader is complete, everything in this function happens
   myGame.preloader.on('complete', function() {
     $(window).trigger('resize');
     $('#loading').remove();
     
      myGame.audio = new Audio();
      myGame.audio.addAudioElement('theme', {
        filepath: 'assets/audio/intro.ogg',
        loop : true,
        play: true
      });
      myGame.audio.addAudioElement('sucuk', {
        filepath: 'assets/audio/sucuk.ogg',
        loop : false,
        play: false
      });
      // Add "scene1" to director
      myGame.director.add('intro');
      myGame.director.add('gameover');
      myGame.director.add('outro');
      myGame.director.add('church');
      myGame.director.add('temple-1');
      myGame.director.add('temple-2');
      myGame.director.add('war-1');
      myGame.director.add('war-2');
      myGame.director.add('family');

      myGame.viewport.$element.append('<div id="dialog" style="display: none"><span class="who"></span><span class="what"></span></div>');
      myGame.viewport.$element.append('<div id="tutorial">Press <span class="key">W</span>, <span class="key">S</span>, <span class="key">A</span> or <span class="key">D</span> to move around <br /><br />Press <span class="key">F</span> to interact or fight.</div>')

      // Show "scene1"
      myGame.director.show('intro');
   });

   // Set asset list for preloader
   myGame.preloader.assets = assetList;

   // Spin up the preloader
   myGame.preloader.start();
   return myGame;
}); 
