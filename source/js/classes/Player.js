export default class Player extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, blockedLayer){
        super(game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;

        this.blockedLayer = blockedLayer;

        this.health = 100;
        this.maxDamage = 10;

        this.speed = 100;
        this.fireRate = 100;
        this.nextFire = 0;
        this.bulletSpeed = 200;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.onDown.add(this.fire, this);

        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(10, 'bullet-1');
        this.bullets.forEach((bullet) => {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });

        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.game.add.existing(this);
    }

    fire(){
        if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0){
            this.nextFire = this.game.time.now + this.fireRate;

            let bullet = this.bullets.getFirstDead();
            bullet.reset(this.x, this.y);

            let shootAngleDeg = Phaser.Math.radToDeg( this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed) );
            let shootInfo = {
                angleDeg: shootAngleDeg,
                speed: this.bulletSpeed,
                x: parseInt(bullet.x),
                y: parseInt(bullet.y)
            };

            GLOBAL.manager.broadcast({
                type: 'shoot',
                bullet: shootInfo
            });
        }
    }

    addDamage(data){
        this.health -= data.damage;
        console.log('addDamage currentHealth: ', this.health);
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

        this.game.physics.arcade.collide(this.bullets, this.blockedLayer, (bullet) => {
            bullet.kill();
        });

        this.onlineUpdate();
    }

    onlineUpdate(){
        GLOBAL.manager.broadcast({
            type: 'position',
            posX: parseInt(this.position.x),
            posY: parseInt(this.position.y)
        });
    }
}