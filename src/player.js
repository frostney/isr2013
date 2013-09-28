define('isr/player', ['jquery', 'isr', 'isr/config', 'isr/entity'], function($, Game, Config, Entity) {
   console.log('Entity')
   console.log(Entity)
   var $activeScene;
   var $activeCharacter;
   
   // current player position
   var playerMovState = {
      'x' : 0,
      'y' : 2,
      'facing' : 'up',
      // var to indicate if character is currently moving
      'moving' : false
   };
   var lives = 3;
   var startTime = 0;
   
   
   Game.director.on('scene:change', function(sceneName) {
      console.log('switched scene to ' +sceneName);
      $activeScene = $('#' + sceneName);
      $activeCharacter = $activeScene.find('#character');
   });
   
   $('body').keyup(function(e) {
      console.log('Player movement listener reporting to duty');
      var charPos = $activeCharacter.offset();
      // W || Arrow up
      var up = ~~((e.keyCode === 87) || (e.keyCode === 38));
      // S || Arrow down
      var down = ~~((e.keyCode === 83) || (e.keyCode === 40));
      // A || Arrow left
      var left = ~~((e.keyCode === 65) || (e.keyCode === 37));
      // D || Arrow right
      var right = ~~((e.keyCode === 68) || (e.keyCode === 39));
      // space for interaction
      var space = ~~(e.keyCode === 32);
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

      /*var newPos = {
         left : charPos.left,
         top : charPos.top
      };*/
      
      // move player
      if (!playerMovState.moving && direction) {
        Entity.move({
           'elemMovState' : playerMovState,
           '$scene' : $activeScene,
           '$element' : $activeCharacter,
           'direction' : direction
        });
      }
      
      if (space) {
         doAction();
      }
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
   });
   
   /**
    * Function to do stuff like fight or talk
    */
   var doAction = function() {
      // first check direction
      var targetTile = {
         x : playerMovState.x,
         y : playerMovState.y
      };
      switch(playerMovState.facing) {
         case 'up':
            targetTile.y += 1;
         break;
         case 'down':
            targetTile.y -= 1;
         break;
         case 'left':
            targetTile.x -= 1;
         break;
         case 'right':
            targetTile.y += 1;
         break;
      }
      // check if on there is sth on the tile the player is facing to interact with
      var interactableStuff = $activeScene.find('#x' + targetTile.x + '-y' + targetTile.y + ' .interactable');
      interactableStuff.each(function(index) {
         if ($(this).hasClass('attackable')) {
            // TODO do fancy animation
         } else if ($(this).hasClass('talkable')) {
            alert('Your are talking to someone');
         }
      });
      if (interactableStuff.length === 0) {
         //TODO add fancy sword swing into empty air
         alert('You successfully killed empty air');
      }
   };
   
   var decreaseLives = function() {
      lives--;
      if (lives === 0) {
         alert('Game over');
         location.reload();
      }
   };
   
   return {
      'playerMovState' : playerMovState,
      'decreaseLives' : decreaseLives
   };
}); 