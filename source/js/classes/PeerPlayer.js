export default class PeerPlayer extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, peer) {
        super(game, posX, posY, spriteName);

        this.peer = peer;

        this.game.physics.arcade.enable(this);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    updatePosition(data){
        this.position.x = data.posX;
        this.position.y = data.posY;
        //console.log('updatePosition: ', updatePosition);
    }

    getNickname(){
        return this.peer.peer;
    }

}