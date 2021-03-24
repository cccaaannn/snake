class Food{
    constructor({canvas, scale=15, color="#ff004cb9", isFilled=true}){
        // coordinates
        this.x;
        this.y;

        // customization
        this.scale = scale;
        this.color = color;
        this.isFilled = isFilled;

        // utility
        this.foodCounter = 0;

        // canvas
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width / this.scale;
        this.height = canvas.height / this.scale;

        this.getRandomPosition(); // spawn food at start 
    }

    resetFood(){
        this.foodCounter = 0;
    }

    getRandomPosition(){
        // generates a random location for the food
        this.x = (Math.floor(Math.random() * this.width - 1) + 1) * this.scale;
        this.y = (Math.floor(Math.random() * this.height - 1) + 1) * this.scale;
    }

    draw(){
        // draws food
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.rect(this.x, this.y, this.scale, this.scale);
        this.ctx.stroke();
        if(this.isFilled){
            this.ctx.fill();
        }
        this.ctx.closePath();
    }

}