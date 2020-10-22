var model = {
  score: 0,
  avatar: new Avatar(),
  screen: new Screen(),
  bullets: [],
  enemies: [],
  level: 1,
  justHit: false,
  gameOver: false,
  winner: false,

  // Creates a new bullet and adds it to the bullets array
  avatarFire: function() {
    model.bullets.push(new Bullet());
  },

  // Moves all bullets up and remove any that go out of bounds
  updateBullets: function() {
    var allBullets = model.bullets;
    for (var b in allBullets) {
      allBullets[b].y -= allBullets[b].dy;
      if (allBullets[b].y <= -20) {
        allBullets.splice(b, 1);
      }
    }
  },

  // Creates a new enemy and adds it to the enemies array
  generateEnemy: function() {
    var max = 100;
    var spawnRate = 50; // Change this number spawn rate, lower = more
    var random = Math.floor(Math.random() * max);

    if (spawnRate < random) {
      model.enemies.push(new Enemy());
      model.totalEnemies++;
      model.spawnTimer = 0;
    }
  },

  // Moves all enemies and remove any that go out of bounds
  updateEnemies: function() {
    var allEnemies = model.enemies, currE;
    for (var e in allEnemies) {
      currE = allEnemies[e];
      currE.x +=   currE.dx;
      currE.y +=   currE.dy;
      if (currE.x <= -50 || currE.x >= 800 ||
        currE.y <= -50 || currE.y >= 800) {
          allEnemies.splice(e, 1);
      }
    }
  },

  // Checks for collisions and processes accordingly
  checkCollisions: function() {
    model.justHit = false;

    var avatar = model.avatar;
    var bullets = model.bullets;
    var enemies = model.enemies;
    var emax = enemies.length;
    var bmax = bullets.length;

    var currE, bullet;
    for (var i = 0; i < emax; i++) {
      // Collision between avatar and enemy
      currE = enemies[i];
      if (
        (avatar.x < currE.x + currE.size && avatar.x + avatar.size > currE.x) && (avatar.y < currE.y + currE.size && avatar.y + avatar.size > currE.y)
      ) {
        model.enemyHitsAvatar(currE);
        break;
      }
      // Collision between bullet and enemy
      for (var j = 0; j < bmax; j++) {
        bullet = bullets[j];
        if (
          (bullet.x < currE.x + currE.size && bullet.x + bullet.sizeX > currE.x) && (bullet.y < currE.y + currE.size && bullet.y + bullet.sizeY > currE.y)
        ) {
          model.bulletHitsEnemy(bullet, currE);
          break;
        }
      }
      }
      //check to see if player is dead
      if (avatar.hp <= 0) {
          this.gameOver = true;
      }

      //check to see if player won
      if (this.score >= 300) {
          this.winner = true;
      }
    },

  enemyHitsAvatar: function(enemy) {
    model.avatar.hp -= 1;
    model.killEnemy(enemy);
    model.justHit = true;
  },

  bulletHitsEnemy: function(bullet, enemy) {
    model.score += 10;
    model.killEnemy(enemy);
    model.killBullet(bullet);
  },

  killBullet: function(bullet) {
    var i = model.bullets.indexOf(bullet);
    if (i >= 0) model.bullets.splice(i, 1);
  },

  killEnemy: function(enemy) {
    var i = model.enemies.indexOf(enemy);
    if (i >= 0) model.enemies.splice(i, 1);
  },
  
  // Update level if reached high enough score
  levelUp: function() {
	if (model.score >= 100 && model.level === 1) {
	  model.level++;
	  model.avatar.image.src = "images/kadabra.png";
	  model.enemies = [];
	  model.Enemy.image.src = "images/haunter.jpg";
	} 
	if (model.score >= 200 && model.level === 2) {
	  model.level++;
	  model.avatar.image.src = "images/alakazam.jpg";
	  model.enemies = [];
	  model.Enemy.image.src = "images/gengar.jpg";
	}
  },
  resetGame: function() {
	  model.score = 0;
	  model.level = 1;
	  model.enemies = [];
	  
	  model.avatar.hp = 1;
	  model.avatar.x = view.max / 2;
	  model.avatar.y = view.max - 100;
	  model.avatar.image.src = "images/abra.jpg";
	  
	  model.gameOver = false;
	  model.winner = false;
  }
};

function Avatar() {
  // Avatar stats
  this.hp = 1;
  //this.damage = 10;

  // Position
  this.x = view.max / 2;
  this.y = view.max - 100;

  // Movement Speed or step size
  this.dx = 10;
  this.dy = 10;

  // Size and Bitmap image
  this.size = 100;
  this.image = new Image();
  this.image.src = "images/abra.jpg";


  // Renders the avatar image on the passed context, which should be a canvas
  this.draw = function(context) {
      context.drawImage(this.image, this.x, this.y, this.size, this.size);
      // red box over player if just got hit
      if (model.justHit == true) {
          context.lineWidth = 20;
          context.strokeStyle = "rgba(232, 14, 14,0.5)";
          context.beginPath();
          context.rect(this.x+25, this.y+25, 50, 50);
          context.stroke();
      }
  };

  // Updates the current position of the avatar
  this.move = function(dir) {
    if (dir == 97) this.x -= this.dx;
    else if (dir == 100) this.x += this.dx;
    else if (dir == 119) this.y -= this.dy;
    else if (dir == 115) this.y += this.dy;

    // contrains avatar's position to never move off the grid
    this.x = Math.max(0, Math.min(this.x, view.max - this.size));
    this.y = Math.max(0, Math.min(this.y, view.max - this.size));
  };
}

function Bullet() {
  // Starting position
  this.x = model.avatar.x + 20;
  this.y = model.avatar.y;

  // Movement Speed or step size
  this.dx = 0;
  this.dy = 20;

  // Size and Bitmap image
  this.sizeX = 10;
  this.sizeY = 20;
  this.image = new Image();
  this.image.src = "images/fireball.png";

  // Renders the bullet image on the passed context, which should be a canvas
  this.draw = function(context) {
    context.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
  };
}

// Enemy drops randomly out of the top of the canvas
function Enemy() {
	
  // Starting position
  this.x = Math.random() * 850 - 50;
  this.y = -50;	
	
  // Size and Bitmap image
  this.size = 50;
  this.image = new Image();
  
  // Random enemy based on level
  enemyNum = Math.floor(Math.random() * model.level) + 1;
  
  if ( enemyNum == 1  ) {
    this.image.src = "images/gastly.png";

    // Movement Speed or step size
    this.scalar = Math.floor(Math.random() * 1.5);
    this.dx = ((Math.random() * 10) - 5) * this.scalar;
    this.dy = (Math.random() * 5) * this.scalar;
  
  } else if ( enemyNum == 2) {
	this.image.src = "images/haunter.png";
    
    // Movement Speed or step size
    this.scalar = Math.floor(Math.random() * 2);
    this.dx = ((Math.random() * 10) - 5) * this.scalar;
    this.dy = (Math.random() * 10) * this.scalar;
	
  } else {
	this.image.src = "images/gengar.png";
	  
    // Movement Speed or step size
    this.scalar = Math.floor(Math.random() * 2);
    this.dx = ((Math.random() * 10) - 5) * this.scalar;
    this.dy = (Math.random() * 10) * this.scalar;
  }	  
  

  

  // Renders the bullet image on the passed context, which should be a canvas
  this.draw = function(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  };
}

function Screen() {
    this.draw = function (context) {
        context.font = "60px Arial";
        context.fillStyle = "red";
        context.fillText("GAME  OVER", 150, 300);
		context.font = "25px Arial";
		context.fillText("CLICK ANYWHERE TO RESTART", 147.8, 350); 
    }

    this.drawWinner = function (context) {
        context.font = "80px Arial";
        context.fillStyle = "aquamarine";
        context.fillText("YOU WIN", 190, 300);
		context.font = "25px Arial";
		context.fillText("CLICK ANYWHERE TO RESTART", 177.8, 350); 
    }
	
	this.drawNext = function (context) {
        context.font = "80px Arial";
        context.fillStyle = "aquamarine";
        context.fillText("NEXT LEVEL", 190, 300);
		context.font = "25px Arial";
		context.fillText("CLICK ANYWHERE TO CONTINUE", 177.8, 350); 
    }
}