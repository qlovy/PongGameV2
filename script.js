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
    // canvas variables
    canvas = document.getElementById("canvas");
    width = this.canvas.width = 800;
    height = this.canvas.height = 800;
    ctx = this.canvas.getContext("2d");

    draw() {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Define a listener on the canvas
    setListener() {
        // Make the canvas handle keyboard event, src=https://gamedev.stackexchange.com/questions/50223/receiving-keyboard-events-on-a-canvas-in-javascript
        this.canvas.setAttribute("tabindex", "0");
        this.canvas.focus();

        // Listen to keydown event
        this.canvas.addEventListener("keydown", this.getKey);
    }

    // Manage key event
    getKey(e) {
        if (e.key === "a") {
            console.log("Your press a");
        }
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