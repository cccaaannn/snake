class tailNode{
    constructor(x, y, scale){
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
}


class Snake{
    constructor({canvas, scale=15, length=0, headColor="#5cb85c", tailColor="#5cb85c", godModeColor="#ffd900", isHeadFilled=true, isTailFilled=false}){
        // head
        this.head = {
            x: 0,
            y: 0,
            preX: 0,
            preY: 0,
        }
        this.direction = Snake.RIGHT;
        
        // tail
        this.tail = [];
        this.length = 0;
        
        // customization
        this.scale = scale;
        this.speed = this.scale;
        this.color = {head:headColor, tail:tailColor, headTemp:headColor, tailTemp:tailColor, godMode:godModeColor};
        this.isFilled = {head:isHeadFilled, tail:isTailFilled}

        // bonusFood
        this.bonusFoodPoints = 0;

        //utility
        this.maxPossibleLength = Math.floor((canvas.width*canvas.height) / (this.scale*this.scale)) - 1;

        // extras
        this.godMode = false;

        // canvas
        this.ctx = canvas.getContext("2d");

        // init snake
        this.initSnake(length);
    }



    // ---------- static directions ----------
    static UP = "up";
    static DOWN = "down";
    static RIGHT = "right";
    static LEFT = "left";
    // ---------- ---------- ----------



    // ---------- get - set ----------
    initSnake(length){
        // init snake with selected length
        for (let i = 0; i < length; i++) {
            this.addTailNode();
        }
    }

    addTailNode(){
        // adds a node to tail
        this.tail.push(new tailNode(this.head.x, this.head.y, this.scale));
        this.length += 1;
    }

    resetSnake(){
        this.bonusFoodPoints = 0;
        this.length = 0;
        this.tail = [];
    }

    getLength(){
        return this.length
    }

    getMaxPossibleLength(){
        return this.maxPossibleLength
    }

    getScore(){
        return this.length + this.bonusFoodPoints;
    }

    isWin(){
        // returns 1 if maximum possible snake size is reached
        if((this.maxPossibleLength - this.length) <= 0){
            return true
        }
        else{
            return false
        }
    }
    // ---------- ---------- ----------



    // ---------- collisions ----------
    checkFoodCollision(food){
        // checks food collision
        if (this.head.x === food.x && this.head.y === food.y) {
            this.addTailNode();
            return true;
        }
        return false;
    }

    checkBonusFoodCollision(bonusFood, bonusFoodTimeRemain){
        // checks bonusFood collision
        if (this.head.x === bonusFood.x && this.head.y === bonusFood.y) {
            this.addTailNode();
            this.bonusFoodPoints += bonusFoodTimeRemain - 1;
            return true;
        }
        return false;
    }

    checkItemSpawn(food){
        // check for food spawn to prevent spawning inside the snake

        if (this.head.x === food.x && this.head.y === food.y) {
            return true;
        }

        for (var i = 0 ; i < this.tail.length; i++) {
            if (this.tail[i].x === food.x && this.tail[i].y === food.y) {
                return true;
            }
        }
        return false;
    }

    checkSelfCollision(){
        // checks self collision
        if(this.godMode){
            return false
        }

        for (var i = 0 ; i < this.tail.length; i++) {
            if (this.head.x === this.tail[i].x && this.head.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }

    checkPreSelfCollision(){
        // checks self collision with PRE HEAD (for slowing the game down)
        if(this.godMode){
            return false
        }
        
        for (var i = 0 ; i < this.tail.length; i++) {
            if (this.head.preX === this.tail[i].x && this.head.preY === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }
    // ---------- ---------- ----------



    // ---------- extras ----------
    toggleGodMode(){
        // toggles invincibility
        if(this.godMode){
            this.godMode = false;
            this.color.head = this.color.headTemp;
            this.color.tail = this.color.tailTemp;
        }
        else{
            this.color.head = this.color.godMode;
            this.color.tail = this.color.godMode;
            this.godMode = true;
        }
    }
    // ---------- ---------- ----------



    // ---------- directions ----------
    changeDirection(direction){
        // changes snakes direction by checking if the direction is valid
        // returns true if the direction is valid

        // if snake has tail, control passing over itself.
        if(this.length > 0){
            if (direction === Snake.UP && this.direction !== Snake.DOWN) {
                this.direction = Snake.UP;
                return true;
            }
            else if (direction === Snake.DOWN && this.direction !== Snake.UP) {
                this.direction = Snake.DOWN;
                return true;
            }
            else if (direction === Snake.LEFT && this.direction !== Snake.RIGHT) {
                this.direction = Snake.LEFT;
                return true;
            }
            else if (direction === Snake.RIGHT && this.direction !== Snake.LEFT) {
                this.direction = Snake.RIGHT;
                return true;
            }
            return false;
        }
        // else, allow mowing back
        else{
            if (direction === Snake.UP) {
                this.direction = Snake.UP;
                return true;
            }
            else if (direction === Snake.DOWN) {
                this.direction = Snake.DOWN;
                return true;
            }
            else if (direction === Snake.LEFT) {
                this.direction = Snake.LEFT;
                return true;
            }
            else if (direction === Snake.RIGHT) {
                this.direction = Snake.RIGHT;
                return true;
            }
            return false;
        }
    }
    // ---------- ---------- ----------



    // ---------- draw and update ----------
    draw(){
        // draw head
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color.head;
        this.ctx.fillStyle = this.color.head;
        this.ctx.rect(this.head.x, this.head.y, this.scale, this.scale);
        this.ctx.stroke();
        if(this.isFilled.head){
            this.ctx.fill();
        }
        this.ctx.closePath();

        // draw tail
        this.ctx.beginPath();
        for (let i = 0; i < this.tail.length; i++) {
            this.ctx.strokeStyle = this.color.tail;
            this.ctx.fillStyle = this.color.tail;
            this.ctx.rect(this.tail[i].x, this.tail[i].y, this.tail[i].scale, this.tail[i].scale);	
        }
        this.ctx.stroke();
        if(this.isFilled.tail){
            this.ctx.fill();
        }
        this.ctx.closePath();

        // debug pre head
        // this.ctx.beginPath();
        // this.ctx.strokeStyle = this.color.head;
        // this.ctx.fillStyle = this.color.head;
        // this.ctx.rect(this.head.preX, this.head.preY, this.scale, this.scale);
        // this.ctx.stroke();
        // this.ctx.closePath();
    }

    update(){
        // update snake and tails location before drawing
            
        // update tails location
        if(this.tail.length > 0){
            for (let i = this.tail.length - 1; i > 0; i--) {
                this.tail[i].x = this.tail[i-1].x;
                this.tail[i].y = this.tail[i-1].y;
            }

            // first node to heads position
            this.tail[0].x = this.head.x;
            this.tail[0].y = this.head.y;
        }

        // move HEAD and PRE HEAD to the direction (pre head is for pre collision detection)
        if(this.direction === Snake.RIGHT){
            this.head.x += this.speed;

            this.head.preY = this.head.y; 
            this.head.preX = this.head.x + this.speed;
        }
        else if(this.direction === Snake.LEFT){
            this.head.x -= this.speed;

            this.head.preY = this.head.y;   
            this.head.preX = this.head.x - this.speed;
        }
        else if(this.direction === Snake.UP){
            this.head.y -= this.speed;

            this.head.preX = this.head.x;
            this.head.preY = this.head.y - this.speed;
        }
        else if(this.direction === Snake.DOWN){
            this.head.y += this.speed;

            this.head.preX = this.head.x;
            this.head.preY = this.head.y + this.speed;
        }
    
        // teleport HEAD on edges
        if(this.head.x + this.scale > canvas.width && this.direction === Snake.RIGHT){
        	this.head.x = 0;
        }
        else if(this.head.x < 0 && this.direction === Snake.LEFT){
        	this.head.x = canvas.width - this.scale;  //tp to right - width of cube 
        }
        else if(this.head.y + this.scale > canvas.height && this.direction === Snake.DOWN){
        	this.head.y = 0;
        }
        else if(this.head.y < 0 && this.direction === Snake.UP){
        	this.head.y = canvas.height - this.scale;
        }


        // teleport PRE HEAD on edges
        if(this.head.preX + this.scale > canvas.width && this.direction === Snake.RIGHT){
        	this.head.preX = 0;
        }
        else if(this.head.preX < 0 && this.direction === Snake.LEFT){
        	this.head.preX = canvas.width - this.scale;  //tp to right - width of cube      
        }
        else if(this.head.preY + this.scale > canvas.height && this.direction === Snake.DOWN){
        	this.head.preY = 0;
        }
        else if(this.head.preY < 0 && this.direction === Snake.UP){
        	this.head.preY = canvas.height - this.scale;
        }


        // draw after each update
        this.draw();
    }
    // ---------- ---------- ----------

}