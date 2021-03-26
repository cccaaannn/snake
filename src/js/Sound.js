class Sound{
    constructor(){
        this.eat = new Audio('src/sounds/eatSound.wav');
        this.death = new Audio('src/sounds/deathSound.wav');
        this.highScore = new Audio('src/sounds/highScoreSound.wav');
        this.menuEffect = new Audio('src/sounds/menuEffectSound.wav');
        this.start = new Audio('src/sounds/startGameSound.wav');
        this.bonusFoodSpawn = new Audio('src/sounds/bonusFoodSpawnSound.wav');
        this.bonusFoodEat = new Audio('src/sounds/bonusFoodEatSound.wav');

        this.soundOn = true;
        this.playHighScoreSound = true;
    }

    static EAT = "eat";
    static DEATH = "death";
    static HIGH_SCORE = "highScore";
    static MENU_EFFECT = "menuEffect";
    static START = "start";
    static BONUS_FOOD_SPAWN = "bonusFoodSpawn";
    static BONUS_FOOD_EAT = "bonusFoodEat";

    resetSounds(){
        this.playHighScoreSound = true;
    }

    toggleSound(){
        if(this.soundOn){
            this.soundOn = false;
        }
        else{
            this.soundOn = true;
        }
    }

    play(sound){
        if(this.soundOn){
            if(sound === Sound.EAT){
                this.eat.play();
            }
            else if(sound === Sound.DEATH){
                this.death.play();
            }
            else if(sound === Sound.HIGH_SCORE && this.playHighScoreSound){ // high score sound (play once per game)
                this.highScore.play();
                this.playHighScoreSound = false;
            }
            else if(sound === Sound.MENU_EFFECT){
                this.menuEffect.play();
            }
            else if(sound === Sound.START){
                this.start.play();
            }
            else if(sound === Sound.BONUS_FOOD_SPAWN){
                this.bonusFoodSpawn.play();
            }
            else if(sound === Sound.BONUS_FOOD_EAT){
                this.bonusFoodEat.play();
            }

        }
    }
}