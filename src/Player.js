define('isr/player', ['jquery', 'isr', 'isr/config', 'isr/entity'], function($, Game, Config, Entity) {
   var $activeScene;
   var $activeCharacter;
   
   // current player position
   var playerTilePos = {
      'x' : 0,
      'y' : 2,
      'facing' : 'up'
   };
   var startTime = 0;
   // var to indicate if character is currently moving
   var moving = false;
   
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
      if (!moving && direction) {
        move(direction);
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
         x : playerTilePos.x,
         y : playerTilePos.y
      };
      switch(playerTilePos.facing) {
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
   /**
    * Function to move player to the next tile from his position
    * @param {Object} direction
    * @param {Object} callBack
    */
   var move = function(direction, callBack) {
      if (direction === '') {
         return;
      }
      var targetTiles = Entity.checkMove(playerTilePos, direction, $activeScene);
      console.log(targetTiles)
      if (!moving && !$.isEmptyObject(targetTiles)) {
         var movOptions;
         switch (direction) {
            case 'up':
               movOptions = {
                  'top' : '-=' + Config.tile.width
               };
               break;
            case 'down':
               movOptions = {
                  'top' : '+=' + Config.tile.width
               };
               break;
            case 'left':
               movOptions = {
                  'left' : '-=' + Config.tile.width
               };
               break;
            case 'right':
               movOptions = {
                  'left' : '+=' + Config.tile.width
               };
               break;
         }
         moving = true;
         playerTilePos = targetTiles;

         $activeCharacter.animate(movOptions, 'slow', function() {
            // TODO add player rotation in the right direction
            moving = false;
            if (callBack) {
               callBack();
            }
         });
      } else {
         // TODO add player rotation in the right direction
         playerTilePos.facing = direction;
         return;
      }
   };
   return {
      'playerTilePos' : playerTilePos
   };
}); 