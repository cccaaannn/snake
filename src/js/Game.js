// html elements
const fpsSelector = document.getElementById('fps');
const soundBox = document.getElementById('sound');
const saveGameBox = document.getElementById('saveGame');
const startButton = document.getElementById('startButton');
const lengthScoreDiv = document.getElementById('lengthScore');
const scoreDiv = document.getElementById('score');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// add listeners (keydown listener starts on play button press)
document.addEventListener("DOMContentLoaded", init);
fpsSelector.addEventListener("change", changeFPS);
soundBox.addEventListener("change", soundToggle);
saveGameBox.addEventListener("change", saveGameToggle);
startButton.addEventListener("click", start);

// set canvas size
canvas.width = 1200; 
canvas.height = 600;

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

// static game
const WIN = "WIN";
const DEATH = "DEATH";

// game objects
let snake = new Snake({canvas:canvas});
let food = new Food({canvas:canvas});
let bonusFood = new BonusFood({canvas:canvas});
let sound = new Sound();
let storage = new Storage("snakeGameSave");


// ---------- event listener functions ----------
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
		updateScores();
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

function init(){
	loadGame();
	updateScores();
}

function start(){
	// hide play button and display canvas
	canvas.style.display="block";
	startButton.style.display="none";
	startButton.blur();

	document.addEventListener("keydown", keydownEvent);
	
	sound.play(Sound.START);
	registerServiceWorker();
	gameLoop();
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

	// draw scores
	scoreDiv.innerText = `Score: ${snake.getScore()} - Best score: ${highScore}`;
	lengthScoreDiv.innerText = `🐍 Length: ${snake.getLength()} - Best length: ${highLength} / ${snake.getMaxPossibleLength()} ${highestLengthEE} 🐍`;
	document.title = `🐍 Snake S:${snake.getScore()}-B:${highScore} ${highestLengthEE}`;

	saveGame();
}

function resetGameOn(condition){
	if(condition === WIN){
		sound.play(Sound.START);
	}
	else if(condition === DEATH){
		sound.play(Sound.DEATH);
	}

	sound.resetSounds();
	snake.resetSnake();
	food.resetFood();
	bonusFood.resetBonusFood();

	updateScores();
}

function bonusFoodDeSpawnController(){
	bonusFoodDeSpawnCounter = (bonusFoodDeSpawnCounter + 1) % (bonusFood.bonusFoodDeSpawnTime + 1);					// increase bonusFood deSpawn counter without letting it overflow at some point if game is idle

	if(bonusFood.isBonusFoodActive && bonusFood.bonusFoodDeSpawnTime === bonusFoodDeSpawnCounter){					// check for bonusFood deSpawn counter
		bonusFood.isBonusFoodActive = false;																		// reset bonusFood deSpawn counter 
		bonusFoodDeSpawnCounter = 0;
	}
}
// ---------- ---------- ----------


// ---------- load save game ----------
function loadGame(){
	// load if there is a saved game and check the save game box
	if(storage.isTherePreviousSave()){
		saveGameBox.checked = true;
		let items = storage.getFromStorage();
		highScore = items.highScore;
		highLength = items.highLength;
	}
}

function saveGame(){
	// save game if save game box is checked
	if(saveGameBox.checked){
		let items = {
			highScore : highScore,
			highLength : highLength
		}
		storage.setToStorage(items);
	}
}

function saveGameToggle(){
	// clear saves on un-checking the save game box
	if(saveGameBox.checked){
		saveGame();
	}
	else{
		storage.clearStorage();
	}
	saveGameBox.blur();
	sound.play(Sound.MENU_EFFECT);
}
// ---------- ---------- ----------


// ---------- pwa ----------
function registerServiceWorker(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js").then(registration => {

        }).catch(error => {
            console.log("service worker can not registered");
            console.log(error);
        })
    }
}
// ---------- ---------- ----------



function gameLoop(){
   requestAnimationFrame(gameLoop);
	
   	now = Date.now() 
	if (now - fpsTimer < 1000 / FPS){																				// fps limiter
		return;
	}

	if(preCollision){																								// slow the game down on pre collision 
		preCollision = false;
		FPS = JSON.parse(fpsSelector.value).slowDownFPS;															// change fps to slower version
		return;																										// exit from this frame to prevent collision for 1 frame
	}
	else{
		FPS = JSON.parse(fpsSelector.value).FPS;																	// set fps back to normal
	}

    ctx.clearRect(0, 0, canvas.width, canvas.height);																// clear canvas



	// snake Controller
	if(!snake.changeDirection(currentDirection)){																	// check if entered direction is possible to move
		snake.changeDirection(previousDirection);																	// use previously entered direction if new direction is not possible 
	}																												// last 2 directions kept to prevent eating itself on rapid change of direction (faster than frame rate)
	
	snake.update();																									// update has to be done before checking self collision (new nodes starts on top of each other)

	preCollision = snake.checkPreSelfCollision();																	// check pre collision to slow down the game

	if(snake.checkSelfCollision()){																					// check self collision
		resetGameOn(DEATH);																							// reset game on death
	}


	// food Controller
	if(snake.checkFoodCollision(food)){																				// check food collision
		sound.play(Sound.EAT);																						// play eat sound
		updateScores();																								// update scores after eat

		if(snake.isWin()){																							// check win condition
			resetGameOn(WIN);																						// reset game on win
		}

		while(snake.checkItemSpawn(food)){ 																			// re-spawn food (prevent spawning inside the snake)
			food.getRandomPosition();
		}

		food.foodCounter++;																							// increase food counter for bonusFood spawn
	}
	food.draw();																									// draw food


	// bonusFood Spawn Controller
	if(food.foodCounter === bonusFood.spawnBonusFoodAfter){															// check food count for bonusFood spawn
		sound.play(Sound.BONUS_FOOD_SPAWN);																			// play spawn sound

		bonusFood.getRandomPosition();																				// start an initial random position
		while(snake.checkItemSpawn(bonusFood)){ 																	// re-spawn (prevent spawning inside the snake)
			bonusFood.getRandomPosition();
		}

		bonusFood.isBonusFoodActive = true;																			// activate bonus food
		food.foodCounter = 0;																						// reset food counter
		bonusFoodDeSpawnCounter = 0;																				// reset bonusFood deSpawn counter 
	}

	// bonusFood Controller
	if(bonusFood.isBonusFoodActive){																				// check bonusFood collision if it is active
		let bonusFoodTimeRemain = bonusFood.bonusFoodDeSpawnTime - bonusFoodDeSpawnCounter;							// find remaining time for bonusFood
		if(snake.checkBonusFoodCollision(bonusFood, bonusFoodTimeRemain)){											// check bonusFood collision
			sound.play(Sound.BONUS_FOOD_EAT);																		// play eat sound
			updateScores();																							// update scores after eat

			bonusFood.isBonusFoodActive = false;																	// deactivate BonusFood
			bonusFoodDeSpawnCounter = 0;																			// reset bonusFood deSpawn counter

			if(snake.isWin()){																						// check win condition
				resetGameOn(WIN);																					// reset game on win
			}
		}
		else{
			bonusFood.draw(bonusFoodTimeRemain);																	// draw bonusFood with countdown
		}
	}


	fpsTimer = now;
}


