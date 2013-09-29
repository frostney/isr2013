define('isr/player', ['jquery', 'isr', 'isr/config', 'isr/entity'], function($, Game, Config, Entity) {
   var $activeScene;
   var $activeCharacter;
   var scenePlayer = {
      'church' : {'x': 5, 'y' : 8},
      'family' : {'x': 8, 'y' : 4},
      'temple-1' : {'x': 5, 'y' : 8},
      'temple-2' : {'x': 5, 'y' : 8},
      'war-1' : {'x': 0, 'y' : 3},
      'war-2' : {'x': 0, 'y' : 3}
   };
   // current player position
   var playerMovState = {
      'x' : 0,
      'y' : 2,
      'facing' : 'up',
      // var to indicate if character is currently moving
      'moving' : false,
      'level' : 0
   };
   var lives = 3;
   var startTime = 0;
   
   
   Game.director.on('scene:change', function(sceneName) {
      // save current player pos to scenePlayer
      if ($activeScene && $activeScene.length > 0 && scenePlayer[$activeScene[0].id]) {
         scenePlayer[$activeScene[0].id].x = playerMovState.x;
         scenePlayer[$activeScene[0].id].y = playerMovState.y;
      }
      console.log('switched scene to ' +sceneName);
      $activeScene = $('#' + sceneName);
      $activeCharacter = $activeScene.find('.character');
      if ($activeCharacter.length > 0) {
         // get last player pos of player of this scene
         playerMovState.x = scenePlayer[sceneName].x;
         playerMovState.y = scenePlayer[sceneName].y;
         $activeCharacter.css('left', playerMovState.x * Config.tile.width);
         $activeCharacter.css('top', playerMovState.y * Config.tile.height);
      }

   });
   
   $('body').keydown(function(e) {
      var charPos = $activeCharacter.offset();
      var direction;
      // W || Arrow up
      if (~~((e.keyCode === 87) || (e.keyCode === 38))) {
         direction = 'up';
      } // S || Arrow down
      else if (~~((e.keyCode === 83) || (e.keyCode === 40))) {
         direction = 'down';
      } // A || Arrow left
      else if (~~((e.keyCode === 65) || (e.keyCode === 37))) {
         direction = 'left';
      } // D || Arrow right
      else if (~~((e.keyCode === 68) || (e.keyCode === 39))) {
         direction = 'right';
      } else {
         return false;
      }
      
      // move player
      if (!playerMovState.moving && direction) {
        if ($('#dialog').length > 0) {
          $('#dialog').fadeOut(500);
        }
        Entity.move({
           'elemMovState' : playerMovState,
           '$scene' : $activeScene,
           '$element' : $activeCharacter,
           'direction' : direction,
           'callback' : function() {
              // trigger global playerMoved and scene specific playerMoved events
              Game.director.currentScene.trigger('playerMoved', playerMovState, $activeScene[0].id);
              //Game.director.trigger('playerMoved', playerMovState);
           }
        });
      }
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
   });
   
   $('body').keyup(function(e) {
      // F for interaction
      var action = ~~(e.keyCode === 70);

      
      if (action) {
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
     var $dialogWindow = $('#dialog');
     
      // first check direction
      var targetTile = {
         x : playerMovState.x,
         y : playerMovState.y
      };
      switch(playerMovState.facing) {
         case 'up':
            targetTile.y -= 1;
         break;
         case 'down':
            targetTile.y += 1;
         break;
         case 'left':
            targetTile.x -= 1;
         break;
         case 'right':
            targetTile.x += 1;
         break;
      }
      Entity.doActionAnim($activeScene.find('.character'), playerMovState.facing);
      
      // check if on there is sth on the tile the player is facing to interact with
      var foundSth = false;
      $activeScene.find('#x' + targetTile.x + '-y' + targetTile.y + '.talkable').each(function(index) {
         foundSth = true;
         var $tile = $(this);
         $dialogWindow.css('left', function(index, value) {
            var left = parseInt($tile.css('left'), 10) + Config.tile.width;
            // 266 is dialog width
            if ((left + 266) > Config.viewport.width) {
               left = Config.viewport.width - 266;
            }
            return left;
         }).css('top', $tile.css('top'));
         $dialogWho = $dialogWindow.find('.who');
         $dialogWhat = $dialogWindow.find('.what');
         console.log('Your are talking to someone');
         //TODO open dialog or sth similar
         if ($tile.hasClass('knight old')) {
            $dialogWho.text(Config.dialog.masterTemplar.who);
            $dialogWhat.text(Config.dialog.masterTemplar.what);
            playerMovState.level = 1;
         } else if ($tile.hasClass('socket tablecloth')) {
            $dialogWho.text(Config.dialog.socket.who);
            $dialogWhat.text(Config.dialog.socket.what);
            $tile.removeClass('tablecloth');
            playerMovState.level = 2;
            // show scene arrows
            $tile.parents('#tile-container:first').find('.tile.arrow.left').addClass('items');
         } else if ($tile.hasClass('wife')) {
            $dialogWho.text(Config.dialog.wife2.who);
            $dialogWhat.text(Config.dialog.wife2.what);
            $tile.parents('#tile-container:first').find('.tile.arrow.up').addClass('items');
            playerMovState.level = 3;
            // show scene arrows
            $tile.parents('#tile-container:first').find('.tile.arrow.up').addClass('items');
         } else if ($tile.hasClass('sign')) {
            $dialogWho.text(Config.dialog.sign.who);
            $dialogWhat.text(Config.dialog.sign.what);
         } else if ($tile.hasClass('knight')) {
            $dialogWho.text(Config.dialog.knight.who);
            $dialogWhat.text(Config.dialog.knight.what);
         }
         $dialogWindow.fadeIn(300);
      });
      // TODO make die animation more generic
      $activeScene.find('#x' + targetTile.x + '-y' + targetTile.y + '.attackable').each(function(index) {
         $(this).remove();
      });
      // attack non attackable element
      // attack moving attackable element
      $activeScene.find('.attackable[data-x="' + targetTile.x + '"][data-y="' + targetTile.y + '"]').each(function(index) {
         foundSth = true;
      // TODO do fancy animation
         $(this).addClass('dead');
         var tileX = $(this).attr('data-x');
         var tileY = $(this).attr('data-y');
         $(this).remove();
         // remove enemy
         $(this).fadeOut('slow');
         var $tile = $activeScene.find('#x' + tileX + '-y' + tileY);
         $tile.hide();
         $tile.fadeIn('slow', function() {
            $(this).addClass('items dead');
         });
      });
      if (!foundSth) {
         //TODO add fancy sword swing into empty air
      }
   };
   
   var decreaseLives = function() {
      lives--;
      if (lives === 0) {
         Game.director.show('gameover');
         return false;
      }
      return true;
   };
   
   return {
      'playerMovState' : playerMovState,
      'decreaseLives' : decreaseLives
   };
}); 