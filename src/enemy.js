define('isr/enemy', ['jquery', 'isr', 'isr/player', 'isr/entity'], function($, Game, Player, Entity) {
   var enemyTiles = {
      'war-1' : [],
      'war-2' : []
   };
   var $currentScene;
   var $currentEnemies;
   Game.director.on('scene:change', function(sceneName) {
     // only start enemy movement if scene is active
     if (sceneName === 'war-1' || sceneName === 'war-2') {
       $activeScene = $('#' + sceneName);
       $currentEnemies = $activeScene.find('.enemy');
       startMovement();
     }
   });

   Game.director.currentScene.on('startKIMovement', function() {
      $currentEnemies.each(function() {
         var pos = {
            'x' : parseInt($(this).attr('data-x')),
            'y' : parseInt($(this).attr('data-y'))
         };
         // check if player is in range and move to him
         if (checkIfPlayerInRange(pos, 3)) {
            alert('Moving to player');
            // TODO attack player
         } else {
            // else idle around an move a bit
         }
         
      });
   });

   /*
    * Check if player is in range of pos coordinates
    */
   var checkIfPlayerInRange = function(pos, range) {
      
      if (Math.abs(Player.playerTilePos.x - pos.x) < range && Math.abs(Player.playerTilePos.y - pos.y) < range) {
         return true;
      }
      return false;
   };
});