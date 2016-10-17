export default class PeerPlayer extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, connectedPlayer, blockedLayer) {
        super(game, posX, posY, spriteName);
        // this.game.physics.arcade.enable(this);
        this.game.physics.box2d.enable(this);
        this.connectedPlayer = connectedPlayer;
        this.blockedLayer = blockedLayer;

        this.anchor.setTo(0.5, 0.5);
        this.initBullets();
        this.initPlayerName();

        this.game.add.existing(this);
        this.body.kinematic = true;
    }

    initPlayerName() {
        const textStyle = {font: "10px Arial", fill: "#fff"};
        const playerNameUI = this.game.add.text(this.width/2, this.height, this.connectedPlayer.playerName, textStyle);
        playerNameUI.anchor.setTo(0.5);
        this.addChild(playerNameUI);
    }

    updatePosition(data){
        // if(data.posX > this.position.x){
        //     this.scale.x = -1;
        // } else {
        //     this.scale.x = 1;
        // }

        this.position.x = data.posX;
        this.position.y = data.posY;
    }

    initBullets() {
        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(10, 'bullet-2');
        this.bullets.forEach((bullet) => {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });
    }

    shoot(data){
        let dataPoint = new Phaser.Point(data.bullet.x, data.bullet.y);

        let bullet = this.bullets.getFirstDead();
        bullet.reset(dataPoint.x, dataPoint.y);

        let newPoint =  Phaser.Point.rotate(new Phaser.Point(dataPoint.x + 10, dataPoint.y), dataPoint.x, dataPoint.y, data.bullet.angleDeg, true);
        this.game.physics.arcade.moveToXY(bullet, newPoint.x, newPoint.y, data.bullet.speed);
    }

    update(){
        this.game.physics.arcade.collide(this.bullets, this.blockedLayer, (bullet) => {
            this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.4);
            bullet.kill();
        });
    }

}