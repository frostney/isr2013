(function(scene) {
   // add event listener for changing scenes based on player position
   scene.on('playerMoved', function(playerMovState, sceneName) {
      if (sceneName !== scene.name) {
         return;
      }
      //console.log('war-1 checking if we need to change the scene, current ' + scene.parent.currentScene.name);
      if (playerMovState.x === 11 && playerMovState.level === 1) {
         scene.parent.show('war-2');
      } else if (playerMovState.x === 0 && playerMovState.level === 2) {
         // check if player has found the holy table cloth
         scene.parent.show('church');
      }
   });

   console.log(scene.modules);
   var Config = scene.modules.ISR.Config;
   // console.log(Config);
   var tile = [];
   var enemy = [];
   // var kindArr = ['obstacle wall', 'obstacle ruin'];

   var skyHeight = 0;
   var tileWidth = Config.tile.width;
   var tileHeight = Config.tile.height;
   var tileLimitX = Config.tilesLimit.x;
   //12
   var tileLimitY = Config.tilesLimit.y;

   for (var x = 0; x < (tileLimitX); x++) {
      for (var y = 0; y < tileLimitY; y++) {
         var kind = '';
         var style = 'top: ' + (tileWidth * y) + 'px; left: ' + (tileHeight * x) + 'px;';

         if (y===0 || y=== 8) {
            kind = 'obstacle items wall';
         } else if (['3-2', '3-6'].indexOf(x + '-' + y) !== -1) {
            kind = 'obstacle items ruin1';
         } else if (['0-1', '0-2'].indexOf(x + '-' + y) !== -1) {
            kind = 'npc knight right spear';
         } else if (['9-2', '9-6'].indexOf(x + '-' + y) !== -1) {
            kind = 'obstacle items ruin2';
         } else if (['4-1', '4-5', '8-1', '8-5'].indexOf(x + '-' + y) !== -1) {
            kind = 'obstacle items ruin3';
         } else if (['1-2'].indexOf(x + '-' + y) !== -1) {
            kind = 'obstacle items sign talkable';
         } else if (x === 0) {
            kind = 'items arrow left';
         } else if (x === 11) {
            kind = 'items arrow right';
         }
         if (['10-3', '10-4', '10-5'].indexOf(x + '-' + y) !== -1) {
            // add enemies
            enemy.push({
               'data-x' : x,
               'data-y' : y,
               style : style
            });
         }

         tile.push({
            id : 'x' + x + '-y' + y,
            style : style,
            kind : kind
         });

      }
   }
   var Player = scene.modules.ISR.Player;
   scene.on('active', function() {
      if (Player.playerMovState.level === 1) {
         // hide left arrows
         $('.tile.arrow.right').addClass('items');
         $('.tile.arrow.left').removeClass('items');
      } else if (Player.playerMovState.level === 2) {
         $('.tile.arrow.left').addClass('items');
         $('.tile.arrow.right').removeClass('items');
      }
   });

   scene.expose({
      title : scene.t('title', {
         'name' : scene.name
      }),
      tile : tile,
      enemy : enemy
   });

})(this);
