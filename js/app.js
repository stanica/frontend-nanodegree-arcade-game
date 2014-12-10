// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //Position enemy just off-screen and randomly
    this.x = -spriteWidth;
    this.y = Math.floor(((Math.random()*(numRows-3))+1))*83 - 25;
    this.speed = Math.floor( (Math.random()*3)*100 + 300 );
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > canvasWidth){
        this.x = -spriteWidth;
        this.y = Math.floor(((Math.random()*(numRows-3))+1))*83 - 25;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    //Set default player location to be center of screen
    this.x = spriteWidth * Math.floor(numCols / 2);
    this.y = canvasHeight - spriteHeight  - spriteHeight/3;

    this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function(dt) {

};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x - spriteWidth >= 0){
        this.x -= spriteWidth;
    }
    else if (key === "right" && this.x + spriteWidth * 2 <= canvasWidth){
        this.x += spriteWidth;
    }
    else if (key === "up" && this.y - 83 >= 0){
        this.y -= 83;
    }
    else if (key === "down" && this.y + 83  < canvasHeight - spriteHeight){
        this.y += 83;
        levelUp();
    }
};
var levelUp = function () {
    level++;
    if (level > 1){
        expandBoard();
    }
    allEnemies = [];
    for (var x=0; x<level*3; x++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
levelUp();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'up',
        65: 'left',
        83: 'down',

    };

    player.handleInput(allowedKeys[e.keyCode]);
});
