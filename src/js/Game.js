// html elements
const fpsSelector = document.getElementById('fps');
const soundBox = document.getElementById('sound');
const lengthScoreDiv = document.getElementById('lengthScore');
const scoreDiv = document.getElementById('score');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// add listeners
document.addEventListener("keydown", keydownEvent);
fpsSelector.addEventListener("change", changeFPS);
soundBox.addEventListener("change", soundToggle);

// game variables
let FPS = JSON.parse(fpsSelector.value).FPS;
let fpsTimer = 0;

// score variables
let highScore = 0;
let highLength = 0;
let highestLengthEE = "";

// bonus food
let bonusFoodDeSpawnCounter = 0;
setInterval(bonusFoodDeSpawnController, 1000);

// snake direction variables
// last 2 directions kept to prevent eating itself on rapid change of direction (faster than frame rate)
let previousDirection = Snake.RIGHT;
let currentDirection = Snake.RIGHT;
let preCollision = false;

// game objects
let snake = new Snake({canvas:canvas});
let food = new Food({canvas:canvas});
let bonusFood = new BonusFood({canvas:canvas});
let sound = new Sound(true);


// ---------- event listeners ----------
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

	// cheats
    else if (keyCode === 192) {
		snake.addTailNode();
    }
    else if (keyCode === 49) {
		snake.toggleGodMode();
		sound.play(Sound.MENU_EFFECT);
    }
}

function soundToggle(){
	// toggles sound
	sound.toggleSound();
	sound.play(Sound.MENU_EFFECT);
	soundBox.blur();
}

function changeFPS(){
	// changes fps
	FPS = fpsSelector.value;
	sound.play(Sound.MENU_EFFECT);
	fpsSelector.blur();
}
// ---------- ---------- ----------


// ---------- game functions ----------
function updateScores(){
	if(snake.getScore() > highScore){
		highScore = snake.getScore();
		sound.play(Sound.HIGH_SCORE);
	}

	if(snake.getLength() > highLength){
		highLength = snake.getLength();
	}

	// display 👑 for the highest possible length
	if(snake.getMaxPossibleLength() == highLength){
		highestLengthEE = "👑";
	}
	// display 😒 if cheated for higher length
	else if(highLength > snake.getMaxPossibleLength()){
		highestLengthEE = "😒";
	}

	scoreDiv.innerText = `Score: ${snake.getScore()} - Best score: ${highScore}`;
	lengthScoreDiv.innerText = `🐍 Length: ${snake.getLength()} - Best length: ${highLength} / ${snake.getMaxPossibleLength()} ${highestLengthEE} 🐍`;

	document.title = `🐍 Snake S:${snake.getScore()}-B:${highScore} ${highestLengthEE}`;
}

function bonusFoodDeSpawnController(){
	bonusFoodDeSpawnCounter++;

	if(bonusFood.isBonusFoodActive && bonusFood.bonusFoodDeSpawnTime === bonusFoodDeSpawnCounter){
		bonusFood.isBonusFoodActive = false;
		bonusFoodDeSpawnCounter = 0;
	}
}

function resetGameOnDeath(){
	updateScores();
	sound.play(Sound.DEATH);
	sound.resetSounds();
	snake.resetSnake();
	food.resetFood();
	bonusFood.resetBonusFood();
}

function resetGameOnWin(){
	updateScores();
	sound.play(Sound.START);
	sound.resetSounds();
	snake.resetSnake();
	food.resetFood();
	bonusFood.resetBonusFood();
}
// ---------- ---------- ----------




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
		resetGameOnDeath();
	}

	// check food collision
	if(snake.checkFoodCollision(food)){
		sound.play(Sound.EAT);
		
		if(snake.isWin()){
			resetGameOnWin();
		}

		// re-spawn food (prevent spawning inside the snake)
		while(snake.checkItemSpawn(food)){ 
			food.getRandomPosition();
		}

		food.foodCounter++;
	}
	food.draw();


	// check food count for bonusFood spawn
	if(food.foodCounter === bonusFood.spawnBonusFoodAfter){
		// play spawn sound
		sound.play(Sound.BONUS_FOOD_SPAWN);

		// start an initial random position
		bonusFood.getRandomPosition(); 

		// re-spawn (prevent spawning inside the snake)
		while(snake.checkItemSpawn(bonusFood)){ 
			bonusFood.getRandomPosition();
		}

		// activate bonus food for drawing, reset deSpawn and food counters
		bonusFood.isBonusFoodActive = true;
		food.foodCounter = 0;
		bonusFoodDeSpawnCounter = 0;
	}

	// draw bonusFood if it is active
	if(bonusFood.isBonusFoodActive){
		// draw bonusFood with countdown
		let bonusFoodTimeRemain = bonusFood.bonusFoodDeSpawnTime - bonusFoodDeSpawnCounter;
		bonusFood.draw(bonusFoodTimeRemain);

		if(snake.checkBonusFoodCollision(bonusFood, bonusFoodTimeRemain)){
			sound.play(Sound.BONUS_FOOD_EAT);

			bonusFood.isBonusFoodActive = false;
			bonusFoodDeSpawnCounter = 0;

			if(snake.isWin()){
				resetGameOnWin();
			}
		}
	}


	// update score
	updateScores();

	fpsTimer = now;
}



gameLoop();
