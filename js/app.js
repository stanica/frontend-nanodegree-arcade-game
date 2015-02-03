// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //Position enemy just off-screen and randomly between the water and grass
    this.x = -spriteWidth;
    this.y = Math.floor(((Math.random()*(numRows-4))))*83 + 83*2;
    this.speed = Math.floor( (Math.random()*3)*100 + 200 );
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
        //Randomize vertical position of the enemy to be between the water and grass tiles
        this.y = Math.floor(((Math.random()*(numRows-4))))*83 + 83*2;
    }
    this.width = spriteWidth;
    this.height = 77;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.livesSprite = 'images/Heart.png';
    this.width = 67;
    this.height = 88;
    this.lives = 3;
    //Center player on board
    this.resetPosition();
};

Player.prototype.update = function(dt) {
    for (var x=0; x<allEnemies.length; x++) {
        if (isCollide(this, allEnemies[x])){
            this.lives --;
            this.resetPosition();
        }
    }
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for(var i = 0; i< this.lives; i++){
        ctx.drawImage(Resources.get(this.livesSprite), (numCols - i - 1) * spriteWidth, 0, 67, 60);
    }
};

Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x - this.width >= 0){
        this.x -= spriteWidth;
    }
    else if (key === "right" && this.x + this.width * 2 <= canvasWidth){
        this.x += spriteWidth;
    }
    else if (key === "up" && this.y - this.height >= 0){
        this.y -= 83;
    }
    else if (key === "down" && this.y + 83  < canvasHeight - this.height){
        this.y += 83;
    }
};

// Reset position of player to center of game board
Player.prototype.resetPosition = function (){
    //Center player horizontally by calculating width of board
    this.x =  Math.floor(numCols / 2 * spriteWidth) - this.width / 2;
    //Position player on the lowest row of blocks
    this.y = numRows * this.height - this.height*1.5;
};

//
var levelUp = function (player) {
    level++;
    if (level > 1 && level < 4){
        expandBoard("rows");
    }
    allEnemies = [];
    for (var x=0; x<level*3; x++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
    player.resetPosition();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
levelUp(player);

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
        68: 'right'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
