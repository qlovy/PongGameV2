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
    #canvas = document.getElementById("canvas");
    #width = this.#canvas.width = 800;
    #height = this.#canvas.height = 600;
    #ctx = this.#canvas.getContext("2d");

    #stars;
    #sticks;
    #ball;

    // Private method

    // Public method

    init(){
        let offx = 20;
        let offy = 20;
        this.#sticks.push()
    }

    #draw() {
        this.#ctx.fillStyle = "blue";
        this.#ctx.fillRect(0, 0, this.#width, this.#height);

        // Background, dark blue with yellow stars, stroke white rect
        let ox = 50;
        let oy = 50;
        let dx = 700;
        let dy = 300;
        let nbStars = 80;

        // Dark blue sky
        this.#ctx.fillStyle = "#192a56";
        this.#ctx.fillRect(ox, oy, dx, dy);

        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 3;
        this.#ctx.strokeRect(ox, oy, dx, dy);

        // Yellow stars

        // Setup stars one time
        if (this.#stars === undefined){
            this.#stars = this.#randomStars(ox, oy, dx, dy, nbStars);
        }

        this.#ctx.fillStyle = "yellow";
        for (let i=0; i< nbStars; i++){
            let star = this.#stars[i];
            this.#ctx.beginPath();
            this.#ctx.arc(star.x, star.y, star.r, 0, 360);
            this.#ctx.fill();
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
    setListener() {
        // Make the canvas handle keyboard event, src=https://gamedev.stackexchange.com/questions/50223/receiving-keyboard-events-on-a-canvas-in-javascript
        this.#canvas.setAttribute("tabindex", "0");
        this.#canvas.focus();

        // Listen to keydown event
        this.#canvas.addEventListener("keydown", this.#getKey);
    }

    // Manage key event
    #getKey(e) {
        if (e.key === "a") {
            console.log("Your press a");
        }
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
        ctx.strokeRect(this.#x, this.#y, this.#width, this.#height);
    }
}

// Initialization of the game's object
const pongGame = new Game;

// add a listener
pongGame.setListener();

function gameLoop() {
    pongGame.draw();

    // Call the function gameLoop 60 frames per second
    window.requestAnimationFrame(gameLoop);
}

gameLoop();