import MovableObject from './MovableObject';

const anchorPosition = {x: 0.5, y: 0.2},
    shootPower = 10;

export default class Player extends MovableObject{
    constructor(game, posX, posY, spriteName){
        super(game, posX, posY, spriteName, anchorPosition);
        this.game.physics.box2d.enable(this);
        this.body.setCircle(20);

        this.startPos = new Phaser.Point(posX, posY);

        this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.08, 0.08);

        this.initValues();
        this.initMovement();
        this.initBullets();
        this.game.input.addMoveCallback(this.updateDirection.bind(this));

        this.lastOnlinePosition = new Phaser.Point(this.x, this.y);

        this.body.fixedRotation = true;
        this.body.mass = 2;
    }

    getShootPower() {
        return this.game.rnd.integerInRange(shootPower/2, shootPower);
    }

    initValues() {
        this.health = 100;
        this.maxDamage = 10;
        this.kills = 0;

        this.speed = 200;
        this.fireRate = 50;
        this.nextFire = 0;
        this.bulletSpeed = 1000;
    }

    update(){
        this.body.setZeroVelocity();

        if(this.cursors.right.isDown || this.cursorsWSAD.right.isDown){
            this.body.velocity.x += this.speed;
        } else if(this.cursors.left.isDown || this.cursorsWSAD.left.isDown){
            this.body.velocity.x -= this.speed;
        }

        if(this.cursors.down.isDown || this.cursorsWSAD.down.isDown){
            this.body.velocity.y += this.speed;
        } else if(this.cursors.up.isDown || this.cursorsWSAD.up.isDown){
            this.body.velocity.y -= this.speed;
        }

        this.updateBlockedGrid(false, true);
        this.onlineUpdate();
    }

    updateDirection() {
        const angle = Phaser.Math.radToDeg(this.game.physics.arcade.angleToPointer(this));

        if(angle > -45 && angle < 45) {
            // right
            this.frame = 0;
            this.scale.x = -1;
        } else if(angle >= 45 && angle < 135) {
            // down
            this.frame = 1;
            this.scale.x = 1;
        } else if(angle >= 135 || angle < -135) {
            // left
            this.frame = 0;
            this.scale.x = 1;
        } else if(angle <= -45 && angle >= -135) {
            // up
            this.frame = 2;
            this.scale.x = 1;
        }
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
            // bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
            bullet.body.collideWorldBounds = false;
            bullet.body.setCategoryContactCallback(2, this.onBulletCollision, this);
            bullet.body.setCategoryContactCallback(3, this.onBulletCollisionDestroy, this);
            bullet.body.setCategoryContactCallback(4, this.onBulletCollisionDamage, this);
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

    onBulletCollisionDamage(body1, body2, fixture1, fixture2, begin, impulseInfo) {
        if(begin) {
            this.game.events.onExplosion.dispatch(body1.x, body1.y, 1);
            
            body1.sprite.kill();
            body1.setZeroVelocity();
            
            if(body2.sprite) {
                body2.sprite.addDamage(this.getShootPower());
            }
        }
    }

    fire(){
        if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0){
            this.nextFire = this.game.time.now + this.fireRate;

            let bullet = this.bullets.getFirstDead();
            bullet.reset(this.x - (25 * this.scale.x), this.y - 3);

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