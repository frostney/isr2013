define('isr/player', ['jquery', 'isr'], function($, Game) {
   $('body').keyup(function(e) {
      var charPos = $('#character').offset();

      var up = ~~((e.keyCode === 87) || (e.keyCode === 38));
      // W || Arrow up
      var down = ~~((e.keyCode === 83) || (e.keyCode === 40));
      // S || Arrow down
      var left = ~~((e.keyCode === 65) || (e.keyCode === 37));
      // A || Arrow left
      var right = ~~((e.keyCode === 68) || (e.keyCode === 39));
      // D || Arrow right

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

      var newPos = {
         left : charPos.left,
         top : charPos.top
      };

      // todo movement

   });
   
      /**
    * Function to check if movement in desired direction is possible
    * @param {Object} direction
    */
   var checkMove = function(direction) {
      var tileToMove = {
         'x' : playerTilePos.x,
         'y' : playerTilePos.y
      };
      switch(direction) {
         case 'left':
            if (playerTilePos.x === 0) {
               return false;
            }
            tileToMove.x -= 1;
            break;
         case 'right':
            if (playerTilePos.x === (Config.tileWidth - 1)) {
               return false;
            }
            tileToMove.x += 1;
            break;
         case 'up':
            if (playerTilePos.y === 0) {
               return {};
            }
            tileToMove.y -= 1;
            break;
         case 'down':
            if (playerTilePos.y === (Config.tileHeight - 1)) {
               return false;
            }
            tileToMove.y += 1;
            break;
      }

      // check if next tile is accessible
      if ($('#x' + tileToMove.x + '-y' + tileToMove.y).hasClass('notAccessible')) {
         return {};
      }
      return tileToMove;
   };
   
   /**
    * Function to check if there is sth on the current tile and pick it up
    */
   var checkAndPickUp = function() {
      $('#x' + playerTilePos.x + '-y' + playerTilePos.y).find('.item').each(function(index) {

         var itemName = $(this).attr('class').split(' ');
         Inventory.addItem(itemName[itemName.length - 1]);
         Config.sound.play('happy');
         $(this).remove();
      });
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
      var targetTiles = checkMove(direction);
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

         $('#character').animate(movOptions, 'slow', function() {
            moving = false;
            if (callBack) {
               callBack();
            }
         });
      } else {
         return;
      }
   };
}); 