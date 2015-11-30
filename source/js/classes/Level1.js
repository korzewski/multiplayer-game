import Player from './Player';
import PeerPlayer from './PeerPlayer';

export default class Level1 extends Phaser.State{
    create(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('simples_pimples', 'level1-tiles');
        this.blockedLayer = this.map.createLayer('blocked');
        this.blockedLayer.resizeWorld();
        this.map.setCollisionBetween(1, 10000, true, 'blocked');

        this.coins = this.game.add.group();
        this.coins.enableBody = true;
        this.map.createFromObjects('money', 'mm', 'coin', 0, true, false, this.coins);

        this.player = new Player(this.game, 80, 100, 'player');
        this.game.camera.follow(this.player);

        this.connectedPlayers = {};

        this.scores = 0;
        this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right'};
        this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
        this.scoresLabel.fixedToCamera = true;
        this.scoresLabel.cameraOffset.setTo(10, 10);

        this.game.events.onUserConnected.add(this.onUserConnected, this);
        this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);

    }

    onUserConnected(conn){
        if(conn.peer != GLOBAL.manager.nickname){
            this.connectedPlayers[conn.peer] = new PeerPlayer(this.game, 200, 100, 'player', conn);
            console.log('connectedPlayers: ', this.connectedPlayers);
        } else {

        }
    }

    onUserDataUpdate(peerName, data){
        //console.log('onUserDataUpdate peerName: ', peerName);
        //console.log('onUserDataUpdate data: ', data);
        //
        //console.log('this.connectedPlayers: ', this.connectedPlayers);
        this.connectedPlayers[peerName].updatePosition(data);
    }


    update(){
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    }

    collectCoin(player, coin){
        coin.kill();
        this.addPoints();
    }

    addPoints(){
        this.scores += 10;
        this.scoresLabel.text = 'scores: ' + this.scores;
    }

    //render() {
    //    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //    this.game.debug.spriteCoords(this.player, 32, 500);
    //}
}

