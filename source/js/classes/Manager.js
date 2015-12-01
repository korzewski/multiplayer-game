var io = require('socket.io-client')();
var $ = require('jquery');

export default class Manager{
    constructor(){
        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();

        this.nickname = prompt('your nickname?');


        this.connectedPeers = [];
        this.updateCurrentPlayersList();

        this.peer = new Peer(this.nickname, { host: location.hostname, port: 9000 });

        this.peer.on('connection', (conn) => {
            conn.on('open', () => {
                conn.on('data', (data) => {
                    if(conn.peer != this.nickname){
                        GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
                    }
                });
            });
        });

        io.on('user-connected', (newUser) => {
            console.log('user-connected: ', newUser);
            this.connectWithNewPeer(newUser);
        });

        io.on('user-disconnected', (disconnectedUser) => {
            console.log('disconnectedUser: ', disconnectedUser);
        });
    }

    connectWithNewPeer(newUser){
        if(newUser != this.nickname){
            let conn = this.peer.connect(newUser);
            conn.on('open', () => {
                this.connectedPeers.push( conn );
                GLOBAL.game.events.onUserConnected.dispatch(conn);
                console.log('connectedPeers: ', this.connectedPeers);
            });
        }
    }

    broadcast(data){
        this.connectedPeers.forEach((peer, index) => {
            console.log('sending data to peer: ', peer);
            peer.send(data);
        });
    }

    updateCurrentPlayersList(){
        $.ajax({
            url: '/api/allConnectedPeers',
            success: (data) => {
                console.log('success: ', data);
                data.forEach((peer) => {
                    this.connectWithNewPeer(peer.peerID);
                });
            }
        });
    }
}