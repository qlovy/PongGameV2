/*
* OOP in JS, new approach https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Classes_in_JavaScript
* Structure for OOP
*
* Game --> display, other objet and decoration
*      --> score
*      --> ask for collision check
*
* Ball --> display
*      --> check collision
*
* Sticks --> display
*
*
* */

class Game {
    // Private variables
    #canvas;
    #width;
    #height;
    #ctx;

    #stars;
    #sticks;
    #ball;
    #stop = true;
    #player1Score = 0;
    #player2Score = 0;

    #gameArea = {x: 50, y: 50, w: 700, h: 300}

    constructor(canvas){
        // canvas
        this.#canvas = canvas;
        this.#width = canvas.width = 800;
        this.#height = canvas.height = 600;
        this.#ctx = canvas.getContext("2d");
        
        
        this.#setListener();
        this.#initObject();
        this.#draw();
    }

    #initObject(){
        let offX = 20;
        this.#sticks = [new Stick(this.#gameArea.x + offX, this.#gameArea.y + this.#gameArea.h/2 - 50, "red"), new Stick(this.#gameArea.x + this.#gameArea.w - 20 - offX, this.#gameArea.y + this.#gameArea.h/2 - 50, "blue")];
        this.#ball = new Ball(this.#width/2, this.#gameArea.y + this.#gameArea.h/2);
    }

    // Private method
    #draw() {
        /*
        Background, dark blue with yellow stars, stroke white rect
        */
       this.#ctx.fillStyle = "white";
       this.#ctx.fillRect(0, 0, this.#width, this.#height);


        let nbStars = 80;

        // Dark blue sky
        this.#ctx.fillStyle = "#192a56";
        this.#ctx.fillRect(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h);

        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 3;
        this.#ctx.strokeRect(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h);

        // Yellow stars

        // Setup stars one time
        if (this.#stars === undefined){
            this.#stars = this.#randomStars(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h, nbStars);
        }

        this.#ctx.fillStyle = "yellow";
        for (let i=0; i< nbStars; i++){
            let star = this.#stars[i];
            this.#ctx.beginPath();
            this.#ctx.arc(star.x, star.y, star.r, 0, 360);
            this.#ctx.fill();
        }

        /*
        Sticks
        */

        for (let i=0; i<this.#sticks.length; i++){
            this.#sticks[i].draw(this.#ctx);
        }

        /*
        Ball
        */

        this.#ball.draw(this.#ctx);

        /*
        Game stop screen
        */

        if (this.#stop){
            this.#ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            this.#ctx.fillRect(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h);
            this.#ctx.fillStyle = "white";
            this.#ctx.font = "30px sans-serif";
            this.#ctx.fillText("Press Enter to start", this.#gameArea.x + this.#gameArea.w/3, this.#gameArea.y + this.#gameArea.h/2);
        }

        /*
        Scoer
        */
        this.#drawScore();
    }

    #randomStars(ox, oy, dx, dy, nb){
        let r = dx * 0.5/100;
        let stars = [];
        for (let i=0; i<nb; i++){
            let x = Math.floor(ox + r + (dx - 3*r) * Math.random());
            let y = Math.floor(oy + r + (dy - 3*r) * Math.random());
            stars.push({x: x, y: y, r: r});
        }
        return stars;
    }

    // Define a listener on the canvas
    #setListener() {
        // Make the canvas handle keyboard event, src=https://gamedev.stackexchange.com/questions/50223/receiving-keyboard-events-on-a-canvas-in-javascript
        this.#canvas.setAttribute("tabindex", "0");
        //this.#canvas.focus(); Make appear a red bar around the canvas and doesn't affect keyboard event when remove.

        // Listen to keydown event
        this.#canvas.addEventListener("keydown", this.#getKey.bind(this));  // bind is for counter the lost of the ref "this" which can happend with multiple call in an object.
    }

    // Manage key event
    #getKey(e) {
        let key = e.key;
        if (key === 'Enter' && this.#stop){
            this.#stop = false;
            gameLoop();
        }else if (key === 'w'){
            this.#sticks[0].moveUp();
        }else if (key === 's'){
            this.#sticks[0].moveDown();
        }else if (key === 'ArrowUp'){
            this.#sticks[1].moveUp();
        }else if (key === 'ArrowDown'){
            this.#sticks[1].moveDown();
        }
    }

    #checkCollision(){
        // Check collision with the ball
        // Check walls
        
        // Up wall
        if (this.#ball.isCollisionWith(this.#gameArea.x, 0, this.#gameArea.x + this.#gameArea.w, this.#gameArea.y)){
            return 'y';
        }
        // Down wall
        if (this.#ball.isCollisionWith(this.#gameArea.x, this.#gameArea.y + this.#gameArea.h, this.#gameArea.w, this.#gameArea.y + 2 * this.#gameArea.h)){
            return 'y';
        }
        
        // Right wall
        if (this.#ball.isCollisionWith(this.#gameArea.x + this.#gameArea.w, this.#gameArea.y, this.#gameArea.x + 2*this.#gameArea.w, this.#gameArea.h)){
            return 'r';
        }
        // Left wall
        if (this.#ball.isCollisionWith(0, this.#gameArea.y, this.#gameArea.x, this.#gameArea.h)){
            return 'l';
        }

        // Check sticks
        for (let i=0; i<this.#sticks.length; i++){
            if (this.#ball.isCollisionWith(this.#sticks[i].getX(), this.#sticks[i].getY(), this.#sticks[i].getWidth(), this.#sticks[i].getHeight())){
                return 'x';
            }
        }
        return ''
    }

    #drawScore(){
        let offX = 50;
        let offY = 50;
        let dy = 2;
        // Red player
        this.#ctx.font = "30px sans-serif";
        this.#ctx.fillStyle = "red";
        this.#ctx.fillRect(this.#gameArea.x + this.#gameArea.w/2 - offX, this.#gameArea.y + this.#gameArea.h + dy, offX, offY);
        this.#ctx.fillStyle = "white";
        this.#ctx.fillText(this.#player1Score, this.#gameArea.x + this.#gameArea.w/2 - 2*offX/3, this.#gameArea.y + this.#gameArea.h + 2*offY/3 + dy);

        // Blue player
        this.#ctx.fillStyle = "blue";
        this.#ctx.fillRect(this.#gameArea.x + this.#gameArea.w/2, this.#gameArea.y + this.#gameArea.h + dy, offX, offY);
        this.#ctx.fillStyle = "white";
        this.#ctx.fillText(this.#player2Score, this.#gameArea.x + this.#gameArea.w/2 + offX/3, this.#gameArea.y + this.#gameArea.h + 2*offY/3 + dy);
    }

    #drawFinish(){
        if (this.#player1Score === 6){
            this.#ctx.fillStyle = "#e74c3c";
            this.#ctx.fillRect(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h);
            this.#ctx.fillStyle = "white";
            this.#ctx.font = "30px sans serif"
            this.#ctx.fillText("Player 1 Win !", this.#gameArea.x + 2 * this.#gameArea.w/5, this.#gameArea.y + this.#gameArea.h/2);

        }else{
            this.#ctx.fillStyle = "#2980b9";
            this.#ctx.fillRect(this.#gameArea.x, this.#gameArea.y, this.#gameArea.w, this.#gameArea.h);
            this.#ctx.fillStyle = "white";
            this.#ctx.font = "30px sans serif"
            this.#ctx.fillText("Player 2 Win !", this.#gameArea.x + 2 * this.#gameArea.w/5, this.#gameArea.y + this.#gameArea.h/2);
        }
    }

    // Public method
    play(){
        // Check collision
        let direction = this.#checkCollision();
        if (direction === 'l' || direction === 'r'){
            if (direction === 'l'){
                this.#player1Score += 1;
            }else if (direction === 'r'){
                this.#player2Score += 1;
            }
            this.#initObject();
            setTimeout(gameLoop, 2000);
        }
        // Apply collision
        this.#ball.rebound(direction);
        this.#ball.move();
        // Draw
        this.#draw();
        if (direction !== 'l' && direction !== 'r' && this.#player1Score !== 6 && this.#player2Score !== 6){
            // Call the function gameLoop 60 frames per second
            window.requestAnimationFrame(gameLoop);
        }
        if (this.#player1Score === 6 || this.#player2Score === 6){
            this.#drawFinish();
        }
    }
}

class Stick {
    #x;
    #y;
    #width = 20;
    #height = 100;
    #velocity = 4;
    #color;

    constructor(x, y, color) {
        this.#x = x;
        this.#y = y;
        this.#color = color;
    }

    draw(ctx){
        ctx.fillStyle = this.#color;
        ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.#x, this.#y, this.#width, this.#height);
    }

    moveUp(){
        this.#y -= this.#velocity;
    }

    moveDown(){
        this.#y += this.#velocity;
    }

    getX(){return this.#x};

    getY(){return this.#y};

    getWidth(){return this.#width};

    getHeight(){return this.#height};
}

class Ball {
    #x;
    #y;
    #radius = 10;
    #velocityX = -1;
    #velocityY = 1;
    
    #color = "white";

    constructor(x, y){
        this.#x = x;
        this.#y = y;
    }

    draw(ctx){
        ctx.fillStyle = this.#color;
        ctx.beginPath();
        ctx.arc(this.#x, this.#y, this.#radius, 0, 360);
        ctx.fill();
    }

    move(){
        this.#x += this.#velocityX;
        this.#y += this.#velocityY;
    }

    isCollisionWith(x, y, w, h){
        return this.#x >= x && this.#x <= (x + w) && this.#y >= y && this.#y <= (y + h);
    }

    rebound(direction){
        if (direction === 'x'){
            this.#velocityX *= -1;
        }else if (direction === 'y'){
            this.#velocityY *= -1;
        }else if (direction === 'xy'){
            this.#velocityX *= -1;
            this.#velocityY *= -1;
        }
    }
}

// Get page canvas
const canvas = document.getElementById("canvas");

// Initialization of the game's object
const pongGame = new Game(canvas);

function gameLoop() {
    pongGame.play();
}