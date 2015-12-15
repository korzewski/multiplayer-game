export default class Manager{
    constructor(){
        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDisconnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();
        GLOBAL.game.events.onExplosion = new Phaser.Signal();

        this.connectedPeers = [];

        var socket = io();
        socket.on('env', (env, port, allConnectedPeers) => {
            console.log('env: ', env);
            console.log('port: ', port);
            console.log('allConnectedPeers: ', allConnectedPeers);

            if (env === 'production'){
                this.peer = new Peer({
                    host:'/',
                    secure:true,
                    port:443,
                    key: 'peerjs',
                    path: '/api',
                    config: {
                        'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]
                    }
                });
            } else {
                this.peer = new Peer({host: '/', port: port, path: '/api'});
                console.log('peer: ', this.peer);
            }

            this.peerID = this.peer.peer;
            allConnectedPeers.forEach((peerObject) => {
                this.connectWithNewPeer(peerObject.peerID);
            });

            this.peer.on('connection', (conn) => {
                conn.on('open', () => {
                    conn.on('data', (data) => {
                        GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
                    });
                });
            });
        });

        socket.on('user-connected', (newUser) => {
            console.log('user-connected: ', newUser);
            this.connectWithNewPeer(newUser);
        });

        socket.on('user-disconnected', (disconnectedUser) => {
            console.log('user-disconnected: ', disconnectedUser);
            GLOBAL.game.events.onUserDisconnected.dispatch(disconnectedUser);
        });
    }

    connectWithNewPeer(newUser){
        if(newUser != this.peerID){
            let conn = this.peer.connect(newUser);
            conn.on('open', () => {
                this.connectedPeers.push( conn );
                GLOBAL.game.events.onUserConnected.dispatch(conn);
            });
        }
    }

    broadcast(data){
        this.connectedPeers.forEach((peer, index) => {
            peer.send(data);
        });
    }

    sendSingleData(peer, data){
        peer.send(data);
    }
}