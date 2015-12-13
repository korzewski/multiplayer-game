export default class PeerPlayer extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, peer, blockedLayer) {
        super(game, posX, posY, spriteName);

        this.peer = peer;

        this.game.physics.arcade.enable(this);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        this.blockedLayer = blockedLayer;

        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(5, 'bullet-2');
        this.bullets.forEach((bullet) => {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });
    }

    updatePosition(data){
        this.position.x = data.posX;
        this.position.y = data.posY;
    }

    shoot(data){
        let dataPoint = new Phaser.Point(data.bullet.x, data.bullet.y);

        let bullet = this.bullets.getFirstDead();
        bullet.reset(dataPoint.x, dataPoint.y);

        let newPoint =  Phaser.Point.rotate(new Phaser.Point(dataPoint.x + 10, dataPoint.y), dataPoint.x, dataPoint.y, data.bullet.angleDeg, true);
        this.game.physics.arcade.moveToXY(bullet, newPoint.x, newPoint.y, data.bullet.speed);
    }

    getNickname(){
        return this.peer.peer;
    }

    update(){
        this.game.physics.arcade.collide(this.bullets, this.blockedLayer, (bullet) => {
            bullet.kill();
        });
    }

}