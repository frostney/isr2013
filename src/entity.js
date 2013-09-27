define('isr/entity', ['jquery', 'isr', 'isr/config'], function($, Game, Config) {
         /**
    * Function to check if movement in desired direction is possible
    * @param {Object} direction
    */
   var checkMove = function(elemTile, direction, $scene) {
      var tileToMove = {
         'x' : elemTile.x,
         'y' : elemTile.y,
         'facing' : direction
      };
      switch(direction) {
         case 'left':
            if (elemTile.x === 0) {
               return false;
            }
            tileToMove.x -= 1;
            break;
         case 'right':
            if (elemTile.x === (Config.tilesLimit.x - 1)) {
               return false;
            }
            tileToMove.x += 1;
            break;
         case 'up':
            if (elemTile.y === 0) {
               return {};
            }
            tileToMove.y -= 1;
            break;
         case 'down':
            if (elemTile.y === (Config.tilesLimit.y - 1)) {
               return false;
            }
            tileToMove.y += 1;
            break;
      }

      // check if next tile is accessible
      if ($scene.find('#x' + tileToMove.x + '-y' + tileToMove.y).hasClass('notAccessible')) {
         return {};
      }
      return tileToMove;
   };
});