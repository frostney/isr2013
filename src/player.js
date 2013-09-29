define('isr/player', ['jquery', 'isr', 'isr/config', 'isr/entity'], function($, Game, Config, Entity) {
   var $activeScene;
   var $activeCharacter;
   var scenePlayer = {
      'church' : {'x': 5, 'y' : 8},
      'family' : {'x': 5, 'y' : 8},
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
      if ($activeScene) {
         scenePlayer[$activeScene[0].id].x = playerMovState.x;
         scenePlayer[$activeScene[0].id].y = playerMovState.y;
      }
      console.log('switched scene to ' +sceneName);
      $activeScene = $('#' + sceneName);
      $activeCharacter = $activeScene.find('.character');
      // get last player pos of player of this scene
      playerMovState.x = scenePlayer[sceneName].x;
      playerMovState.y = scenePlayer[sceneName].y;
      $activeCharacter.css('left', playerMovState.x * Config.tile.width);
      $activeCharacter.css('top', playerMovState.y * Config.tile.height);

   });
   
   $('body').keyup(function(e) {
      var charPos = $activeCharacter.offset();
      // W || Arrow up
      var up = ~~((e.keyCode === 87) || (e.keyCode === 38));
      // S || Arrow down
      var down = ~~((e.keyCode === 83) || (e.keyCode === 40));
      // A || Arrow left
      var left = ~~((e.keyCode === 65) || (e.keyCode === 37));
      // D || Arrow right
      var right = ~~((e.keyCode === 68) || (e.keyCode === 39));
      // F for interaction
      var action = ~~(e.keyCode === 70);
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
      // check if on there is sth on the tile the player is facing to interact with
      var foundSth = false;
      $activeScene.find('#x' + targetTile.x + '-y' + targetTile.y + '.talkable').each(function(index) {
         foundSth = true;
         $dialogWindow.css('left', parseInt($(this).css('left')) + Config.tile.width).css('top', $(this).css('top'));
         $dialogWho = $dialogWindow.find('.who');
         $dialogWhat = $dialogWindow.find('.what');
         console.log('Your are talking to someone');
         //TODO open dialog or sth similar
         if ($(this).hasClass('knight old')) {
            $dialogWho.text(Config.dialog.masterTemplar.who);
            $dialogWhat.text(Config.dialog.masterTemplar.what);
            playerMovState.level = 1;
         } else if ($(this).hasClass('socket tablecloth')) {
            $dialogWho.text(Config.dialog.socket.who);
            $dialogWhat.text(Config.dialog.socket.what);
            $(this).removeClass('tablecloth');
            playerMovState.level = 2;
         } else if ($(this).hasClass('wife')) {
            $dialogWho.text(Config.dialog.wife2.who);
            $dialogWhat.text(Config.dialog.wife2.what);
            playerMovState.level = 3;
         } else if ($(this).hasClass('sign')) {
            $dialogWho.text(Config.dialog.sign.who);
            $dialogWhat.text(Config.dialog.sign.what);
         } else if ($(this).hasClass('knight')) {
            $dialogWho.text(Config.dialog.knight.who);
            $dialogWhat.text(Config.dialog.knight.what);
         }
         $dialogWindow.fadeIn(300);
      });
      // attack
      $activeScene.find('.attackable[data-x="' + targetTile.x + '"][data-y="' + targetTile.y + '"]').each(function(index) {
         foundSth = true;
         // TODO do fancy animation
         // remove enemy
         $(this).remove();
      });
      if (!foundSth) {
         //TODO add fancy sword swing into empty air
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