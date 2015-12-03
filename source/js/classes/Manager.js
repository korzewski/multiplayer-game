var socket = io();




GLOBAL.peer;
socket.on('env', function(env, port){
    console.log('env: ', env);
    console.log('port: ', port);
    if (env === 'production'){
        GLOBAL.peer = new Peer({
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
        GLOBAL.peer = new Peer({host: '/', port: port, path: '/api'});
    }
    GLOBAL.peer.on('open', function(id){
        console.log("peer: ", GLOBAL.peer);
        console.log("peer id: ", id);

        socket.emit('peer connected', id);

        GLOBAL.peer.on('data', (data) => {
            //if(conn.peer != this.nickname){
                GLOBAL.game.events.onUserDataUpdate.dispatch(GLOBAL.peer.peer, data);
            //}
        });

    });

    socket.on('peer connected', (newUser) => {
        console.log('user-connected: ', newUser);
        //this.connectWithNewPeer(newUser);
    });

    socket.on('peer disconnected', (disconnectedUser) => {
        console.log('disconnectedUser: ', disconnectedUser);
    });
});

var $ = require('jquery');

export default class Manager{
    constructor(){
        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();

        //this.nickname = prompt('your nickname?');


        this.connectedPeers = [];
        this.updateCurrentPlayersList();

        //this.peer = new Peer(this.nickname, { host: location.hostname, secure:true, port:443, key: 'peerjs', debug: 3 });
        //this.peer.on('connection', (conn) => {
        //    conn.on('open', () => {
        //        conn.on('data', (data) => {
        //            if(conn.peer != this.nickname){
        //                GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
        //            }
        //        });
        //    });
        //});

        //socket.on('user-connected', (newUser) => {
        //    console.log('user-connected: ', newUser);
        //    this.connectWithNewPeer(newUser);
        //});
        //
        //socket.on('user-disconnected', (disconnectedUser) => {
        //    console.log('disconnectedUser: ', disconnectedUser);
        //});
    }

    connectWithNewPeer(newUser){
        if(newUser != this.nickname){
            let conn = GLOBAL.peer.connect(newUser);
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