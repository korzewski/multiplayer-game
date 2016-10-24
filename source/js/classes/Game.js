import Map from './Map';
import Player from './Player';
import Enemy from './Enemy';
import PeerPlayer from './PeerPlayer';
import Obstacle from './Obstacle';

export default class Game extends Phaser.State{
    preload() {
        this.game.time.advancedTiming = true;
    }

    create(){
        // this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.startSystem(Phaser.Physics.BOX2D);

        this.game.map = new Map(this.game, 'map-1');

        this.game.player = new Player(this.game, 350, 350, 'dustBuster');

        new Enemy(this.game, 300, 150, 'dustBuster2');
        new Enemy(this.game, 350, 150, 'dustBuster2');
        new Enemy(this.game, 0, 200, 'dustBuster2');
        new Enemy(this.game, 350, 200, 'dustBuster2');
        new Enemy(this.game, 500, 0, 'dustBuster2');
        new Enemy(this.game, 800, 0, 'dustBuster2');
        new Enemy(this.game, 500, 500, 'dustBuster2');

        this.scores = 0;
        this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right'};
        this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
        this.scoresLabel.fixedToCamera = true;
        this.scoresLabel.cameraOffset.setTo(10, 10);

        this.healthLabel = this.game.add.text(0, 0, 'health: ' + this.game.player.health, this.textStyle);
        this.healthLabel.fixedToCamera = true;
        this.healthLabel.cameraOffset.setTo(10, 30);

        this.killsLabel = this.game.add.text(0, 0, 'kills: ' + this.game.player.kills, this.textStyle);
        this.killsLabel.fixedToCamera = true;
        this.killsLabel.cameraOffset.setTo(10, 50);

        this.game.events.onUserConnected.add(this.onUserConnected, this);
        this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
        this.game.events.onUserDisconnected.add(this.onUserDisconnected, this);

        this.game.events.onExplosion = new Phaser.Signal();
        this.game.events.onExplosion.add(this.addExplosion, this);
    }

    onUserConnected(connectedPlayer){
        connectedPlayer.gameObject = new PeerPlayer(this.game, 80, 100, 'player', connectedPlayer, this.blockedLayer);

        this.game.manager.sendSingleData(connectedPlayer.peer, {
            type: 'updatePositionRequest'
        });
    }

    onUserDisconnected(player){
        this.game.events.onExplosion.dispatch(player.gameObject.x, player.gameObject.y, 1, 1);
        player.gameObject.destroy();
    }

    onUserDataUpdate(peerID, data){
        if(data.type == 'position'){
            this.game.connectedPlayers[peerID].gameObject.updatePosition(data);
        } else if(data.type == 'shoot'){
            this.game.connectedPlayers[peerID].gameObject.shoot(data);
        } else if(data.type == 'damage'){
            this.game.player.addDamage(data, this.game.connectedPlayers[peerID]);
            this.healthLabel.text = 'health: ' + this.player.health;
        } else if(data.type == 'kill'){
            this.game.player.addKill();
            this.addPoints(100);
            this.killsLabel.text = 'kills: ' + this.game.player.kills;
            this.healthLabel.text = 'health: ' + this.game.player.health;
        } else if(data.type == 'updatePositionRequest'){
            this.game.player.onlineUpdate(true);
        }
    }

    update(){
        // this.game.physics.arcade.collide(this.player, this.blockedLayer);
        // this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

        // for(let connectedPlayer in this.game.connectedPlayers){
        //     this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject, this.player.bullets, this.onConnectedPlayerHit.bind(this));
        //     this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject.bullets, this.player, this.onPlayerHit.bind(this));

        //     for(let connectedPlayer2 in this.game.connectedPlayers){
        //         if(connectedPlayer != connectedPlayer2){
        //             this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject.bullets, this.game.connectedPlayers[connectedPlayer2].gameObject, (player, bullet) => {
        //                 this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
        //                 bullet.kill();
        //             });
        //         }
        //     }
        // }
    }

    render() {
        // this.game.debug.box2dWorld();
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00"); 
    }

    onConnectedPlayerHit(player, bullet) {
        this.game.manager.sendSingleData(player.connectedPlayer.peer, {
            type: 'damage',
            damage: this.player.maxDamage
        });

        this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
        bullet.kill();
    }

    onPlayerHit(player, bullet) {
        this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
        bullet.kill();
    }

    collectCoin(player, coin){
        coin.kill();
        this.addPoints(10);
    }

    addPoints(value){
        this.scores += value;
        this.scoresLabel.text = 'scores: ' + this.scores;
    }

    addExplosion(x, y, maxScale, alpha){
        let explosion = this.game.add.sprite(x, y, 'explosion');
        explosion.animations.add('walk');
        explosion.animations.play('walk', 45, false, true);
        explosion.anchor.setTo(0.5);
        explosion.alpha = alpha || 0.8;

        let randomScale = maxScale - (this.game.rnd.frac() * 0.2);
        explosion.scale.setTo(randomScale);
    }
}