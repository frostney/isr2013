define('mygame', ['lyria/game', 'mygame/scenelist', 'mygame/assetlist'], function(Game, sceneList, assetList) {
  'use strict';
  
  // Create a new game object
	var myGame = new Game();
	
	console.log(myGame);
	
	// Set generated scene files
	myGame.director.scenes = sceneList;
	
	// If preloader is complete, everything in this function happens
	myGame.preloader.on('complete', function() {
    // Add "scene1" to director
    myGame.director.add('scene1');
    // Add "scene2" to director
    myGame.director.add('scene2');

    // Show "scene1"
    myGame.director.show('scene1'); 
  });
  
  // Set asset list for preloader
  myGame.preloader.assets = assetList;
  
  // Spin up the preloader
  myGame.preloader.start();
	
});