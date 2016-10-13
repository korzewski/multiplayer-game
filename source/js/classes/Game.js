import Player from './Player';
import PeerPlayer from './PeerPlayer';

export default class Game extends Phaser.State{
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

        // this.connectedPlayers = {};

        this.scores = 0;
        this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right'};
        this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
        this.scoresLabel.fixedToCamera = true;
        this.scoresLabel.cameraOffset.setTo(10, 10);

        this.healthLabel = this.game.add.text(0, 0, 'health: ' + this.player.health, this.textStyle);
        this.healthLabel.fixedToCamera = true;
        this.healthLabel.cameraOffset.setTo(10, 30);

        this.killsLabel = this.game.add.text(0, 0, 'kills: ' + this.player.kills, this.textStyle);
        this.killsLabel.fixedToCamera = true;
        this.killsLabel.cameraOffset.setTo(10, 50);

        this.game.events.onUserConnected.add(this.onUserConnected, this);
        this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
        this.game.events.onUserDisconnected.add(this.onUserDisconnected, this);

        this.game.events.onExplosion = new Phaser.Signal();
        this.game.events.onExplosion.add(this.addExplosion, this);
    }

    onUserConnected(connectedPlayer){
        connectedPlayer.gameObject = new PeerPlayer(this.game, 80, 100, 'player', connectedPlayer.peer, this.blockedLayer);

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
            this.player.addDamage(data, this.game.connectedPlayers[peerID]);
            this.healthLabel.text = 'health: ' + this.player.health;
        } else if(data.type == 'kill'){
            this.player.addKill();
            this.addPoints(100);
            this.killsLabel.text = 'kills: ' + this.player.kills;
        } else if(data.type == 'updatePositionRequest'){
            this.player.onlineUpdate(true);
        }
    }

    update(){
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

        for(let connectedPlayer in this.game.connectedPlayers){
            this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer], this.player.bullets, (connPlayer, bullet) => {
                this.game.manager.sendSingleData(connPlayer.peer, {
                    type: 'damage',
                    damage: this.player.maxDamage
                });

                this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                bullet.kill();
            });

            this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].bullets, this.player, (connPlayer, bullet) => {
                this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                bullet.kill();
            });

            for(let connectedPlayer2 in this.game.connectedPlayers){
                if(connectedPlayer != connectedPlayer2){
                    this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].bullets, this.game.connectedPlayers[connectedPlayer2], (connectedPlayer, bullet) => {
                        this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                        bullet.kill();
                    });
                }
            }
        }
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

    render() {
        //this.game.debug.text('Active Bullets: ' + this.player.bullets.countLiving() + ' / ' + this.player.bullets.total, 10, 45);
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.spriteCoords(this.player, 32, 500);
    }
}