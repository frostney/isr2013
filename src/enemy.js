define('isr/enemy', ['jquery', 'isr', 'isr/player', 'isr/entity', 'lyria/math'], function($, Game, Player, Entity, LyriaMath) {
   var enemyTiles = {
      'war-1' : [],
      'war-2' : []
   };
   var $currentScene;
   var $currentEnemies;
   Game.director.on('scene:change', function(sceneName) {
      console.log('enemy scene change to '+ sceneName);
      // only start enemy movement if scene is active
      if (sceneName === 'war-1' || sceneName === 'war-2' || sceneName === 'church') {
         $activeScene = $('#' + sceneName);
         $currentEnemies = $activeScene.find('.enemy');
         Game.director.currentScene.on('startKIMovement', kiMovement);
         Game.director.currentScene.trigger({
            name : 'startKIMovement',
            repeat : true,
            interval : 3000
         });
      } else {
         Game.director.currentScene.off('startKIMovement');
      }
   });

   var kiMovement = function() {
      $currentEnemies.each(function() {
         var $enemy = $(this);
         var pos = {
            'x' : parseInt($enemy.attr('data-x')),
            'y' : parseInt($enemy.attr('data-y')),
            'moving' : $enemy.attr('data-movement') === '1'
         };
         // skip this ki evaluation if ki is currently moving
         if (pos.moving) {
            return true;
         }
         var direction;
         // check if player is in range and move to him
         if (checkIfPlayerInRange(pos, 3)) {
            alert('Moving to player');
            direction = 'up';
            // TODO attack player
         } else {
            if (LyriaMath.random(0, 100) > 50) {
               direction = getRandomDirection();
            }
            // else idle around and move a bit
         }
         if (direction) {
            if (Entity.move({
               'elemMovState' : pos,
               '$scene' : $activeScene,
               '$element' : $enemy,
               'direction' : direction,
               'callback' : function() {
                  // set new KI coordinates after movement finished
                  $enemy.attr('data-x', pos.x).attr('data-y', pos.y).attr('data-movement', '0');
               }
            })) {
               // if there was a movement triggered set movement state
               $enemy.attr('data-movement', '1');
            }
         }
      });
   };

   var getRandomDirection = function() {
      switch (LyriaMath.random(1, 4)) {
         case 1:
            return 'up';
         case 2:
            return 'down';
         case 3:
            return 'left';
         case 4:
            return 'right';
      }
   };

   /*
    * Check if player is in range of pos coordinates
    */
   var checkIfPlayerInRange = function(pos, range) {

      if (Math.abs(Player.playerMovState.x - pos.x) < range && Math.abs(Player.playerMovState.y - pos.y) < range) {
         return true;
      }
      return false;
   };
}); 