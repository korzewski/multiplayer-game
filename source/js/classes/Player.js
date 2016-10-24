import MovableObject from './MovableObject';

const scale = 0.5,
    anchorPosition = {x: 0.5, y: 0.2};

export default class Player extends MovableObject{
    constructor(game, posX, posY, spriteName){
        super(game, posX, posY, spriteName, anchorPosition);
        this.scale.setTo(scale);
        this.game.physics.box2d.enable(this);
        this.body.setCircle(20);

        this.startPos = new Phaser.Point(posX, posY);

        this.initValues();
        this.initMovement();
        this.initBullets();

        this.lastOnlinePosition = new Phaser.Point(this.x, this.y);

        this.body.fixedRotation = true;
        this.body.mass = 2;

        this.dir = 1;
    }

    initValues() {
        this.health = 100;
        this.maxDamage = 10;
        this.kills = 0;

        this.speed = 200;
        this.fireRate = 50;
        this.nextFire = 0;
        this.bulletSpeed = 500;
    }

    update(){
        this.body.velocity.x = this.body.velocity.y = 0;

        if(this.cursors.right.isDown || this.cursorsWSAD.right.isDown){
            this.dir = -1;
            this.body.velocity.x += this.speed;
            this.scale.x = -scale;
        } else if(this.cursors.left.isDown || this.cursorsWSAD.left.isDown){
            this.dir = 1;
            this.body.velocity.x -= this.speed;
            this.scale.x = scale;
        }

        if(this.cursors.down.isDown || this.cursorsWSAD.down.isDown){
            this.body.velocity.y += this.speed;
        } else if(this.cursors.up.isDown || this.cursorsWSAD.up.isDown){
            this.body.velocity.y -= this.speed;
        }

        // this.game.physics.arcade.collide(this.bullets, this.blockedLayer, (bullet) => {
        //     this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
        //     bullet.kill();
        // });

        this.updateBlockedGrid();
        this.onlineUpdate();
    }

    initMovement() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cursorsWSAD = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
        this.game.input.onDown.add(this.fire, this);
    }

    initBullets() {
        this.bullets = this.game.add.physicsGroup(Phaser.Physics.BOX2D);
        this.bullets.createMultiple(5, 'bullet-1');
        this.bullets.forEach((bullet) => {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
            bullet.body.collideWorldBounds = false;
            bullet.body.setCategoryContactCallback(2, this.onBulletCollision, this);
            bullet.body.setCategoryContactCallback(3, this.onBulletCollisionDestroy, this);
            bullet.body.sensor = true;
        });
    }

    onBulletCollision(body1, body2, fixture1, fixture2, begin, impulseInfo) {
        if(begin) {
            body1.sprite.kill();
            body1.setZeroVelocity();
            this.game.events.onExplosion.dispatch(body1.x, body1.y, 1);
        }
    }

    onBulletCollisionDestroy(body1, body2, fixture1, fixture2, begin, impulseInfo) {
        if(begin) {
            this.game.events.onGridTileDestroy.dispatch(body2.tilePos);
            this.game.events.onExplosion.dispatch(body1.x, body1.y, 1);
            
            body1.sprite.kill();
            body1.setZeroVelocity();
            
            body2.destroy();
        }
    }

    fire(){
        if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0){
            this.nextFire = this.game.time.now + this.fireRate;

            let bullet = this.bullets.getFirstDead();
            bullet.reset(this.x - (25 * this.dir), this.y - 22);

            let shootAngleDeg = Phaser.Math.radToDeg( this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed) );
            let shootInfo = {
                angleDeg: shootAngleDeg,
                speed: this.bulletSpeed,
                x: parseInt(bullet.x),
                y: parseInt(bullet.y)
            };

            this.game.manager.broadcast({
                type: 'shoot',
                bullet: shootInfo
            });
        }
    }

    addKill(){
        this.kills++;
    }

    addDamage(data, connectedPlayer){
        this.health -= data.damage;
        if(this.health <= 0){
            this.gameOver(connectedPlayer);
        }
    }

    gameOver(connectedPlayer){
        console.log('killed by: ', connectedPlayer);
        this.game.manager.sendSingleData(connectedPlayer.peer, {
            type: 'kill'
        });

        this.resetPlayer();
    }

    resetPlayer() {
        this.position.x = this.startPos.x;
        this.position.y = this.startPos.y;

        this.initValues();

        this.game.manager.broadcast({
            type: 'position',
            posX: parseInt(this.position.x),
            posY: parseInt(this.position.y)
        });
    }

    onlineUpdate(updatePositionRequest){
        if(this.position.x != this.lastOnlinePosition.x || this.position.y != this.lastOnlinePosition.y || updatePositionRequest){
            this.game.manager.broadcast({
                type: 'position',
                posX: parseInt(this.position.x),
                posY: parseInt(this.position.y)
            });

            this.lastOnlinePosition = new Phaser.Point(this.position.x, this.position.y);
        }
    }
}