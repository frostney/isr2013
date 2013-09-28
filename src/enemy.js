define('isr/enemy', ['jquery', 'isr', 'isr/player', 'isr/entity', 'lyria/math'], function($, Game, Player, Entity, LyriaMath) {
   var enemyTiles = {
      'war-1' : [],
      'war-2' : []
   };
   var $currentScene;
   var $currentEnemies;
   Game.director.on('scene:change', function(sceneName) {
      // only start enemy movement if scene is active
      if (sceneName === 'war-1' || sceneName === 'war-2') {
         console.log('enemy scene change to '+ sceneName);
         $activeScene = $('#' + sceneName);
         $currentEnemies = $activeScene.find('.enemy');
         Game.director.currentScene.on('startKIMovement', kiMovement);
         Game.director.currentScene.trigger({
            name : 'startKIMovement',
            repeat : true,
            interval : 2500
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
         if ((direction = checkIfPlayerInRange(pos, 3))) {
            console.log('Moving to player');
            // direction = 'up';
            // TODO attack player
            if (direction === 'attack') {
               alert('ATTACK');
               direction = undefined;
               Player.decreaseLives();
            }
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
      var diff_x = Math.abs(Player.playerMovState.x - pos.x);
      var diff_y = Math.abs(Player.playerMovState.y - pos.y);
      // check if KI is right beside player (only horizontal/vertical not diagonal)
      if ((diff_x === 1 || diff_x === 0) && (diff_y === 1 || diff_y === 0) && !(diff_y === 1 && diff_x === 1)) {
         return 'attack';
      } else if (diff_x < range && diff_y < range) {
         // evaluate in which direction the KI has to move to get to the player
         // first check if horizontal or vertical
         if (diff_x > diff_y) {
            // horizontal
            return (Player.playerMovState.x - pos.x) > 0 ? 'right' : 'left';
         } else {
            // vertical
            return (Player.playerMovState.y - pos.y) > 0 ? 'down' : 'up';
         }
         return true;
      }
      return;
   };
}); 