const fpsSelector = document.getElementById('fps');
const scoreDiv = document.getElementById('score');
const soundBox = document.getElementById('sound');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// add listeners
document.addEventListener("keydown", keydownEvent);
fpsSelector.addEventListener("change", onFPSChange);
soundBox.addEventListener("change", soundToggle);

// static variables
let FPS = JSON.parse(fpsSelector.value).FPS;
let fpsTimer = 0;
let highScore = 0;

// last 2 directions kept to prevent eating itself on rapid change of direction (faster than frame rate)
let previousDirection = Snake.RIGHT;
let currentDirection = Snake.RIGHT;

// check pre collision 
let preCollision = false;

function keydownEvent(e){
    e = e || window.event;
	let keyCode = e.keyCode;

    if (keyCode === 38 || keyCode === 87 || keyCode === 104) {
		previousDirection = currentDirection;
        currentDirection = Snake.UP;
    }
    else if (keyCode === 40 || keyCode === 83 || keyCode === 101) {
		previousDirection = currentDirection;
        currentDirection =  Snake.DOWN;
    }
    else if (keyCode === 37 || keyCode === 65 || keyCode === 100) {
		previousDirection = currentDirection;
		currentDirection =  Snake.LEFT;
    }
    else if (keyCode === 39 || keyCode === 68 || keyCode === 102) {
		previousDirection = currentDirection;
		currentDirection =  Snake.RIGHT;
    }

	// cheat
    else if (keyCode === 192) {
		snake.addTailNode();
    }
}

function soundToggle(){
	// toggles sound
	sound.toggleSound();
	sound.play(Sound.menuEffect);
	soundBox.blur();
}

function onFPSChange(){
	// changes fps
	FPS = fpsSelector.value;
	sound.play(Sound.menuEffect);
	fpsSelector.blur();
}



function gameLoop(){
   requestAnimationFrame(gameLoop);

	// fps limiter
	now = Date.now();
	if (now - fpsTimer < 1000 / FPS){
		return;
	}

	// slow the game down on pre collision 
	if(preCollision){
		preCollision = false;
		FPS = JSON.parse(fpsSelector.value).slowDownFPS;
		return;
	}
	else{
		FPS = JSON.parse(fpsSelector.value).FPS;
	}

	// clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

	// last 2 directions kept to prevent eating itself on rapid change of direction (faster than frame rate)
	if(!snake.changeDirection(currentDirection)){
		snake.changeDirection(previousDirection);
	}


	// update has to be done before checking self collision (new nodes starts on top of each other)
	snake.update();

	// check pre collision 
	preCollision = snake.checkPreSelfCollision();

	// check self collision (reset the game)
	if(snake.checkSelfCollision()){
		sound.play(Sound.death);
		sound.restartSounds();
		snake.resetSnake();
	}

	// check food collision
	if(snake.checkFoodCollision(food)){
		sound.play(Sound.eat);
		// prevent spawning inside the snake
		while(snake.checkFoodSpawn(food)){ 
			food.getRandomPosition();
		}
	}
	food.draw();

	// update score
	if(snake.length > highScore){
		highScore = snake.length
		sound.play(Sound.highScore);
	}

	scoreDiv.innerText = `Score: ${snake.length} - Best: ${highScore}`;
	document.title = "Snake: " + snake.length;

	fpsTimer = now;
}


// setup
let snake = new Snake({canvas:canvas});
let food = new Food({canvas:canvas});
let sound = new Sound(true);


gameLoop();
