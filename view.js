var view = {
  // Dimensions of the canvas in pixels
  max: 700,
  previousTime: 0,
  // Initialize game loop
  init: function() {
    var INTERVAL = 30; // Set pace of game, 30 ~ frames per second
	// Attach eventListener for hitting spacebar for firing
    view.fireListener();
	  
    window.onload = function() {
        var canvas = $("#canvas")[0],
            c = canvas.getContext("2d");
	  
      // Game Loop
      setInterval(function() {
        var currentTime = new Date().getTime();
          //check to see if gameOver variable in model is true
          if (controller.checkGameOver() == true) {
              view.renderGameOver(canvas);
          } else if (controller.checkWinner() == true) {
              view.renderWinner(canvas);
          } else {
			  
			  switch ( controller.checkLevel() ) {
				case 2: canvas.style.backgroundImage="url(images/stage2.png)"; break;
				case 3: canvas.style.backgroundImage="url(images/stage3.png)"; break;
				default: break;
			  }
			  
              view.update(currentTime);
              view.renderAvatar(canvas);
              view.renderBullets(canvas);
              view.renderEnemies(canvas);
              view.renderStats();
          }

        
      }, INTERVAL);
    };
    },

  // Renders the game board state on canvas
  renderAvatar: function(canvas) {
    // supercharge canvas element and clean it out
    var c = canvas.getContext("2d");
    //view.clearCanvas(canvas);
    //I replaced the clearCanvas function with this line which is simpler and doesn't fill with white
    c.clearRect(0, 0, canvas.width, canvas.height);

    // retrieve avatar object from controller
    var avatar = controller.getAvatar();
    // render avatar
    avatar.draw(c);
  },

  renderBullets: function(canvas) {
    var c = canvas.getContext("2d");
    // retrieve bullet objects from controller
    var bullets = controller.getBullets();
    // render bullets
    for (var b in bullets) {
      bullets[b].draw(c);
    }
  },

  renderEnemies: function(canvas) {
    var c = canvas.getContext("2d");
    // retrieve enemy objects from controller
    var enemies = controller.getEnemies();
    // render enemies
    for (var b in enemies) {
      enemies[b].draw(c);
    }
  },

  renderStats: function() {
    $(".current-stat").remove();
    var newDiv = $("<div></div>");
    newDiv.attr("class", "current-stat");
    statArray = controller.getStats();
    newDiv.text(
      //"Current Health: " + statArray[0] +
        " Score: " + statArray[1] +
        " Level: " + statArray[2]
    );
    $(".stats").append(newDiv);
  },

  renderGameOver: function (canvas) {
    var c = canvas.getContext("2d");
    var screen = controller.getScreen();
    screen.draw(c);
  },

  renderWinner: function (canvas) {
    var c = canvas.getContext("2d");
    var screen = controller.getScreen();
    screen.drawWinner(c);
  },
	
  renderNext: function (canvas) {
    var c = canvas.getContext("2d");
    var screen = controller.getScreen();
    screen.drawNext(c);
  },

  // Cleans out the current canvas
  /*clearCanvas: function(canvas) {
    var c = canvas.getContext("2d");
    c.beginPath();
    c.rect(0,0,view.max,view.max);
    c.fillStyle = "white";
    c.fill();
  },*/

  // Main update function
  update: function(currentTime) {
    var LEFT = 97, UP = 119, RIGHT = 100, DOWN = 115; // WASD keys
    controller.generateEnemy(currentTime);
    controller.updateEnemies();
    // Avatar movement
    if (key.isPressed("A") || key.isPressed("left")) controller.updateAvatar(LEFT);
    if (key.isPressed("D") || key.isPressed("right")) controller.updateAvatar(RIGHT);
    if (key.isPressed("W") || key.isPressed("up")) controller.updateAvatar(UP);
    if (key.isPressed("S") || key.isPressed("down")) controller.updateAvatar(DOWN);
    // Update bullet locations
    if (controller.getBullets) controller.updateBullets();
	// Update level if reached high enough score
	controller.levelUp();
    // After updating everything, check and process any collisions
    controller.checkCollisions();
  },

  fireListener: function() {
    // Avatar launching fireball on hitting spacebar
    $(document).on("keydown mousedown", function(e) {
	  switch(e.keyCode) {
	    case 32: case 37: case 38: case 39: case 40: e.preventDefault(); break;
		default: break;
	  }
	  if (e.keyCode == 32 || e.type == "mousedown") controller.avatarFire();
	  if ((controller.checkGameOver() || controller.checkWinner()) && e.keyCode == 82) {
		  controller.resetGame();
	  }
	});
	
  }
};
