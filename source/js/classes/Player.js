export default class Player extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, blockedLayer){
        super(game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;

        this.startPos = new Phaser.Point(posX, posY);

        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.blockedLayer = blockedLayer;

        this.initValues();
        this.initMovement();
        this.initBullets();

        this.lastOnlinePosition = new Phaser.Point(this.x, this.y);
        this.game.add.existing(this);
    }

    update(){
        this.body.velocity.x = this.body.velocity.y = 0;

        if(this.cursors.right.isDown || this.cursorsWSAD.right.isDown){
            this.body.velocity.x += this.speed;
            this.scale.x = -1;
        } else if(this.cursors.left.isDown || this.cursorsWSAD.left.isDown){
            this.body.velocity.x -= this.speed;
            this.scale.x = 1;
        }

        if(this.cursors.down.isDown || this.cursorsWSAD.down.isDown){
            this.body.velocity.y += this.speed;
        } else if(this.cursors.up.isDown || this.cursorsWSAD.up.isDown){
            this.body.velocity.y -= this.speed;
        }

        this.game.physics.arcade.collide(this.bullets, this.blockedLayer, (bullet) => {
            this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
            bullet.kill();
        });

        this.onlineUpdate();
    }

    initValues() {
        this.health = 100;
        this.maxDamage = 10;
        this.kills = 0;

        this.speed = 100;
        this.fireRate = 100;
        this.nextFire = 0;
        this.bulletSpeed = 200;
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
        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(10, 'bullet-1');
        this.bullets.forEach((bullet) => {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });
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