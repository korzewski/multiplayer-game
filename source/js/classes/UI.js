export default class UI extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName){
        super(game, posX, posY, spriteName);

        this.trashCount = 0;

        this.textStyle = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right'};
        this.trash = this.game.add.text(0, 0, `trash: ${this.trashCount}`, this.textStyle);
        this.trash.fixedToCamera = true;
        this.trash.anchor.setTo(1, 0);
        this.trash.cameraOffset.setTo(this.game.camera.width - 20, 10);

        this.playerHealth = this.game.add.text(0, 0, `health: ${this.game.player.health}`, this.textStyle);
        this.playerHealth.fixedToCamera = true;
        this.playerHealth.anchor.setTo(1, 0);
        this.playerHealth.cameraOffset.setTo(this.game.camera.width - 20, 40);

        this.game.events.onEnemyReachDestination.add(this.onEnemyReachDestination, this);
        this.game.events.onPlayerDamage.add(this.onPlayerDamage, this);
        this.game.events.onPlayerDie.add(this.onPlayerDamage, this);
    }

    onEnemyReachDestination() {
    	this.game.camera.shake(0.01, 200);

    	this.trashCount++;
    	this.trash.text = `trash: ${this.trashCount}`;
    }

    updatePlayerHealth() {
    	this.playerHealth.text = `health: ${this.game.player.health}`;
    }

    onPlayerDamage() {
    	this.game.camera.shake(0.02, 300);
    	this.game.camera.flash(0xff0000, 200);
    	this.updatePlayerHealth();
    }
}
