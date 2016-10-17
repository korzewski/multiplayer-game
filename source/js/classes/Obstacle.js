export default class Obstacle extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName){
    	super(game, posX, posY, spriteName);
    	this.game.physics.box2d.enable(this);

    	this.body.setCollisionCategory(3);
    	// this.body.setCircle(10);
    	// this.body.linearDamping = 1;
    	// this.body.angularDamping = 1;
    	// this.body.restitution = 0.3;
    	// this.body.friction = 0;
    	// this.body.mass = 1;

    	this.body.static = true;

    	console.log('Obstacle!: ', spriteName);
    }

    update() {
    	// this.game.physics.arcade.overlap(this, this.game.player.bullets, this.onBulletHit.bind(this), null, this);
    }

    onBulletHit(obstacle, bullet) {
    	console.log('hit! : ', bullet);
    	bullet.kill();
    	if(this) {
    		this.destroy();
    	}
    }

    // collisionHandle(body1, body2, fixture1, fixture2, begin, impulseInfo) {
    //     console.log('booom!: ', body2);
    // }
}