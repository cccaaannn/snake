class BonusFood{
    constructor({canvas, scale=15, color="#a200ff", textColor="white", isFilled=true, spawnBonusFoodAfter=5, bonusFoodDeSpawnTime=4}){
        // coordinates
        this.x;
        this.y;

        // bonusFood options
        this.isBonusFoodActive = false;
        this.spawnBonusFoodAfter = spawnBonusFoodAfter;
        this.bonusFoodDeSpawnTime = bonusFoodDeSpawnTime;

        // customization
        this.scale = scale;
        this.color = {boxColor:color, textColor:textColor};
        this.isFilled = isFilled;

        // canvas
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width / this.scale;
        this.height = canvas.height / this.scale;
    }

    resetBonusFood(){
        this.isBonusFoodActive = false;
    }

    getRandomPosition(){
        // generates a random location for the bonusFood
        this.x = (Math.floor(Math.random() * this.width - 1) + 1) * this.scale;
        this.y = (Math.floor(Math.random() * this.height - 1) + 1) * this.scale;
    }

    draw(countDown){
        // draws bonusFood
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color.boxColor;
        this.ctx.fillStyle = this.color.boxColor;
        this.ctx.rect(this.x, this.y, this.scale, this.scale);
        this.ctx.stroke();
        if(this.isFilled){
            this.ctx.fill();
        }
        this.ctx.closePath();

        // draws bonusFood countdown text
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color.textColor;
        this.ctx.font = `${this.scale}px arial`;
        this.ctx.strokeText(countDown, this.x + (this.scale/5), this.y + this.scale - 2);
        this.ctx.closePath();
    }

}