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

        this.player = new Player(this.game, 80, 100, 'player', this.blockedLayer);
        this.game.camera.follow(this.player);

        this.connectedPlayers = {};

        this.scores = 0;
        this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right'};
        this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
        this.scoresLabel.fixedToCamera = true;
        this.scoresLabel.cameraOffset.setTo(10, 10);

        this.game.events.onUserConnected.add(this.onUserConnected, this);
        this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
        this.game.events.onUserDisconnected.add(this.onUserDisconnected, this);
    }

    onUserConnected(conn){
        if(conn.peer != GLOBAL.manager.nickname){
            this.connectedPlayers[conn.peer] = new PeerPlayer(this.game, 200, 100, 'player', conn, this.blockedLayer);
        }
    }

    onUserDisconnected(userName){
        this.connectedPlayers[userName].destroy();
        delete this.connectedPlayers[userName];
    }

    onUserDataUpdate(peerName, data){
        if(data.type == 'position'){
            this.connectedPlayers[peerName].updatePosition(data);
        } else if(data.type == 'shoot'){
            this.connectedPlayers[peerName].shoot(data);
        } else if(data.type == 'damage'){
            this.player.addDamage(data);
        }
    }

    update(){
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

        for(let connectedPlayer in this.connectedPlayers){
            this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer], this.player.bullets, (connPlayer, bullet) => {
                GLOBAL.manager.sendSingleData(connPlayer.peer, {
                    type: 'damage',
                    damage: this.player.maxDamage
                });
                bullet.kill();
            });

            this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer].bullets, this.player, (connPlayer, bullet) => {
                bullet.kill();
            });

            for(let connectedPlayer2 in this.connectedPlayers){
                if(connectedPlayer != connectedPlayer2){
                    this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer].bullets, this.connectedPlayers[connectedPlayer2], (connectedPlayer, bullet) => {
                        bullet.kill();
                    });
                }
            }
        }
    }

    collectCoin(player, coin){
        coin.kill();
        this.addPoints();
    }

    addPoints(){
        this.scores += 10;
        this.scoresLabel.text = 'scores: ' + this.scores;
    }

    render() {
        //this.game.debug.text('Active Bullets: ' + this.player.bullets.countLiving() + ' / ' + this.player.bullets.total, 10, 45);
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.spriteCoords(this.player, 32, 500);
    }
}