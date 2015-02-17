// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 101 * scaleFactorHeight;
    this.height = 77 * scaleFactorHeight;
    this.row = row;
    //1 = facing right, -1 = facing left
    this.direction = 1;
    //Position enemy just off-screen and randomly between the water and grass
    this.x = -spriteWidth * (Math.floor(Math.random() * 3) +1);
    //this.y = Math.floor(((Math.random()*(numRows-4))))*83 + 83*2;
    this.y = row * spriteHeight + spriteHeight*2 + 5;

    //this.speed = Math.floor( (Math.random()*3)*100 + 200 );
    this.speed = (numRows - row) * 100 - ((numRows - row) * 100) / 2;
};

    // Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.direction * this.speed * dt;
    if (this.x > canvasWidth){
        this.x = -spriteWidth * (Math.floor(Math.random() * Math.floor(this.speed/100)) +1);
        //Randomize vertical position of the enemy to be on a row between the water and grass tiles
        //this.y = Math.floor(((Math.random()*(numRows-4))))*83 + 83*2;
        this.y = (this.row) * spriteHeight + spriteHeight*2 + 5;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Set up initial player variables
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.livesSprite = 'images/Heart.png';
    this.width = 67 * scaleFactorHeight;
    this.height = 88 * scaleFactorHeight;
    this.livesWidth = 67 * scaleFactorHeight;
    this.livesHeight = 60 * scaleFactorHeight;

    //Center player on board
    this.resetPosition();
};

// Handle all collisions between player and all game objects
Player.prototype.update = function(dt) {
    for (var x=0; x<allEnemies.length; x++) {
        if (isCollide(this, allEnemies[x])){
          // lives --;
           //this.resetPosition();
        }
    }
    gameObjects.forEach(function(entity){
        if (isCollide(player, entity)){
            if(entity instanceof Girlfriend){
                levelUp(this);
                girlfriend.resetPosition();
            }
            else if (entity instanceof Gem){
                score += entity.value;
                if (gameObjects[gameObjects.indexOf(entity)].id == entity.id) {
                    //gameObjects[gameObjects.indexOf(entity)] = "";
                    gameObjects.splice(gameObjects.indexOf(entity), 1);
                }
            }
        }
    });
};

// Draw player and lives on screen
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    // Draw hearts at the top right
    for(var i = 0; i< lives; i++){
        ctx.drawImage(Resources.get(this.livesSprite), (numCols - i - 1) * spriteWidth + 15, 15 * scaleFactorHeight, this.livesWidth, this.livesHeight);
    }
    ctx.font = "bold 16px Arial";
    var fontArgs = ctx.font.split(' ');
    var newSize = Math.floor(76 * scaleFactorHeight)+'px';
    ctx.font = newSize + ' ' + fontArgs[fontArgs.length - 1]; /// using the last part
    ctx.fillText(score, 0, 70 * scaleFactorHeight);
};

Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x - this.width >= 0){
        this.x -= spriteWidth;
    }
    else if (key === "right" && this.x + this.width * 2 <= canvasWidth){
        this.x += spriteWidth;
    }
    else if (key === "up" && this.y - this.height * 2 >= 0){
        this.y -= spriteHeight;
    }
    else if (key === "down" && this.y + spriteHeight  < canvasHeight - this.height){
        this.y += spriteHeight;
    }
};

// Reset position of player to center of game board
Player.prototype.resetPosition = function (){
    //Place the player in the bottom grass layer in the center of the middle column
    this.x =  (Math.floor((numCols / 2 * spriteWidth)) - this.width / 2) ;
    //Position player on the lowest row of blocks
    this.y = numRows * this.height - this.height*1.7;
};

// Set up initial girlfriend variables
var Girlfriend = function () {
    this.sprite = 'images/char-pink-girl.png';
    this.width = 76 * scaleFactorHeight;
    this.height = 88 * scaleFactorHeight;

    this.y = (spriteHeight * 2 - this.height /2.5) ;
    this.resetPosition();
};

// Draw girlfriend on screen
Girlfriend.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Girlfriend isn't animated so we don't need this
Girlfriend.prototype.update = function(dt) {

};

// Reset girlfriend to a random position in the top-most stone row
Girlfriend.prototype.resetPosition = function() {
    // Pick a random column in the top-most brick layer and center the girlfriend in that column
    this.x = Math.floor((Math.random() * numCols)) * spriteWidth + ((spriteWidth - this.width) / 2);
};

// Set up intial gem variables
var Gem = function (sprite, value, type) {
    this.sprite = sprite;
    this.value = value;
    this.width = 51 * scaleFactorHeight;
    this.height = 56 * scaleFactorHeight;
    this.id = gameObjects.length;
    this.type = type;

    this.resetPosition();
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}
Gem.prototype.resetPosition = function(){
    // Pick a random column and center the gem in that column
    this.x = Math.floor((Math.random() * numCols)) * spriteWidth + ((spriteWidth - this.width) / 2);

    // Pick a row that isn't the row with the girlfriend
    this.y = Math.floor(((Math.random() * (numRows - 5)) + 3)) * spriteHeight + ((spriteHeight - this.height) / 2 );
}

// Handle level up logic
var levelUp = function () {
    var orangeGemExists = false;
    var blueGemExists = false;
    gameObjects.forEach(function(entities) {
        if (entities instanceof Gem && entities.type == 'orange'){
            orangeGemExists = true;
            entities.resetPosition();
        }
        if (entities instanceof Gem && entities.type == 'blue'){
            blueGemExists = true;
            entities.resetPosition();
        }
    });
    if (!orangeGemExists){
        var orangeGem = new Gem('images/Gem-Orange.png', 100, 'orange');
        gameObjects.push(orangeGem);
    }
    if (level > 3 && !blueGemExists){
        var blueGem = new Gem('images/Gem-Blue.png', 300, 'blue');
        gameObjects.push(blueGem);
    }
    level++;
    if (level > 1 && level < 6){
        expandBoard("rows");
    }
    allEnemies = [];
    for (var x=0; x<numRows-4; x++) {
        enemy = new Enemy(x);
        allEnemies.push(enemy);
    }
    player.resetPosition();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var girlfriend = new Girlfriend();
//var orangeGem;
var gameObjects = [];
gameObjects.push(girlfriend);
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
        68: 'right'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
