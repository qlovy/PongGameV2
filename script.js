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

    #gameArea = {x: 50, y: 50, w: 700, h: 300}

    constructor(canvas){
        // canvas
        this.#canvas = canvas;
        this.#width = canvas.width = 800;
        this.#height = canvas.height = 600;
        this.#ctx = canvas.getContext("2d");
        
        
        this.#setListener();
        let offX = 20;
        this.#sticks = [new Stick(this.#gameArea.x + offX, this.#gameArea.y + this.#gameArea.h/2 - 50, "red"), new Stick(this.#gameArea.x + this.#gameArea.w - 20 - offX, this.#gameArea.y + this.#gameArea.h/2 - 50, "blue")];
        this.#ball = new Ball(this.#width/2, this.#gameArea.y + this.#gameArea.h/2);
        
        this.#draw();
    }

    // Private method
    #draw() {
        this.#ctx.fillStyle = "blue";
        this.#ctx.fillRect(0, 0, this.#width, this.#height);

        /*
        Background, dark blue with yellow stars, stroke white rect
        */


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
        this.#canvas.focus();

        // Listen to keydown event
        this.#canvas.addEventListener("keydown", this.#getKey.bind(this));  // bind is for counter the lost of the ref "this" which can happend with multiple call in an object.
    }

    // Manage key event
    #getKey(e) {
        let key = e.key;
        if (key === 'Enter' && this.#stop){
            this.#stop = false;
            gameLoop();
        }
    }

    #checkCollision(){
        // Check wall

        // Check sticks
    }

    // Public method
    play(){
        // Check collision
        // Apply collision
        // Draw
        this.#draw();
    }
}

class Stick {
    #x;
    #y;
    #width = 20;
    #height = 100;
    #velocity = 0.1;
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

    getX(){return this.#x};

    getY(){return this.#y};

    getWidth(){return this.#width};

    getHeight(){return this.#height};
}

class Ball {
    #x;
    #y;
    #radius = 10;
    #velocity = 0.1;
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
}

// Get page canvas
const canvas = document.getElementById("canvas");

// Initialization of the game's object
const pongGame = new Game(canvas);

function gameLoop() {
    pongGame.play();
    // Call the function gameLoop 60 frames per second
    window.requestAnimationFrame(gameLoop);
}