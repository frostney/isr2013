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
      if ($scene.find('#x' + tileToMove.x + '-y' + tileToMove.y).hasClass('obstacle')) {
         return {};
      }
      return tileToMove;
   };
   
/**
    * Function to move player to the next tile from his position
    * @param {Object} options
    * @param {Object} options.elemMovState
    * @param {String} options.elemMovState.x
    * @param {String} options.elemMovState.y
    * @param {Boolean} options.elemMovState.moving
    * @param {String} options.elemMovState.facing
    * @param {String} options.direction
    * @param {Object} options.$scene
    * @param {Object} options.$element
    * @param {Object} options.callback
    * @return {Boolean} if movement was successfully triggered
    */
   var move = function(options) {
      if (options.direction === '') {
         return false;
      }
      var targetTiles = checkMove(options.elemMovState, options.direction, options.$scene);
      if (!options.elemMovState.moving && !$.isEmptyObject(targetTiles)) {
         var movOptions;
         switch (options.direction) {
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
         options.elemMovState.moving = true;
         $.extend(true, options.elemMovState, targetTiles);

         options.$element.animate(movOptions, 'slow', function() {
            // TODO add player rotation in the right direction
            options.elemMovState.moving = false;
            console.log('end of movement')
            if (options.callback) {
            console.log('end of movement, trigger callback')
               options.callback();
            }
         });
         return true;
      } else {
         // TODO add player rotation in the right direction
         options.elemMovState.facing = options.direction;
         return false;
      }
   };
   return {
      'move' : move
   };
});