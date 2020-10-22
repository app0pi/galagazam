var controller = {
  // Initialize the view, which has the eventhandlers and gameloop
  init: function() {
    view.init();
  },

  // Returns the avatar object
  getAvatar: function() {
    return model.avatar;
  },

  // Returns an array of bullet objects
  getBullets: function() {
    return model.bullets;
  },

  //Returns an array of enemy objects
  getEnemies: function() {
    return model.enemies;
  },

  // Moves the avatar in the new "dir"
  updateAvatar: function(dir) {
    model.avatar.move(dir);
  },

  // Makes the avatar launch a new bullet
  avatarFire: function() {
    model.avatarFire();
  },

  // Updates bullets location in model
  updateBullets: function(dir) {
    model.updateBullets();
  },

  generateEnemy: function(currentTime) {
    model.generateEnemy(currentTime);
  },

  updateEnemies: function() {
    model.updateEnemies();
  },

  checkCollisions: function() {
    model.checkCollisions();
    },

    checkGameOver: function () {
        return model.gameOver;
    },

    getScreen: function () {
        return model.screen;
    },

  getStats: function() {
    return [model.avatar.hp, model.score, model.level, model.justHit, model.gameOver];
  },
  
  // Update level if reached high enough score
  levelUp: function() {
	model.levelUp();
  }
};

// Run the game
$(document).ready(function() {
  controller.init();
});