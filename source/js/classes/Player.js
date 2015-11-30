export default class Player extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName){
        super(game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;

        this.speed = 100;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        //this.onlineLatencyMax = 100;
        //this.onlineLatency = this.onlineLatencyMax;
    }

    update(){
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if(this.cursors.right.isDown){
            this.body.velocity.x += this.speed;
            this.scale.x = -1;
        } else if(this.cursors.left.isDown){
            this.body.velocity.x -= this.speed;
            this.scale.x = 1;
        }

        if(this.cursors.down.isDown){
            this.body.velocity.y += this.speed;
        } else if(this.cursors.up.isDown){
            this.body.velocity.y -= this.speed;
        }

        this.onlineUpdate();
    }

    onlineUpdate(){
        //if(--this.onlineLatency < 0){
        //    this.onlineLatency = this.onlineLatencyMax;
            GLOBAL.manager.broadcast({
                posX: parseInt(this.position.x),
                posY: parseInt(this.position.y)
            });
        //}
    }
}