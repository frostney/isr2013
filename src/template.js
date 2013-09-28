define('isr', ['lyria/game', 'isr/scene', 'isr/scenelist', 'isr/assetlist'], function(Game, Scene, sceneList, assetList) {
  'use strict';
  
  // Create a new game object
	var myGame = new Game();
	
	Scene.requireAlways['isr/config'] = 'ISR.Config';
	
	// Set generated scene files
	myGame.director.scenes = sceneList;
	
	// If preloader is complete, everything in this function happens
	myGame.preloader.on('complete', function() {
	   
    // Add "scene1" to director
    myGame.director.add('church');
    myGame.director.add('temple-1');
    myGame.director.add('temple-2');
    myGame.director.add('war-1');
    myGame.director.add('war-2');
    myGame.director.add('family');

    // Show "scene1"
    myGame.director.show('church'); 
  });
  
  // Set asset list for preloader
  myGame.preloader.assets = assetList;
  
  // Spin up the preloader
  myGame.preloader.start();
  return myGame;
});