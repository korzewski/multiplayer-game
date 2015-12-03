
var $ = require('jquery');

export default class Manager{
    constructor(){
        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();

        this.connectedPeers = [];

        var socket = io();
        socket.on('env', (env, port) => {
            console.log('env: ', env);
            console.log('port: ', port);

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

            this.peer.on('connection', (conn) => {
                console.log('peer on connection: ', conn);

                conn.on('open', () => {
                    conn.on('data', (data) => {
                        console.log('on data: ', data);
                        if(conn.peer != this.nickname){
                            GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
                        }
                    });
                });
            });


            //GLOBAL.peer.on('open', function(id){
            //    GLOBAL.peerID = id;
            //    console.log("peer id: ", id);
            //
            //    socket.emit('peer connected', id);
            //
            //    GLOBAL.peer.on('data', (data) => {
            //        console.log('on data: ', data);
            //        if(GLOBAL.peerID != data){
            //            GLOBAL.game.events.onUserDataUpdate.dispatch(GLOBAL.peer.peer, data);
            //        }
            //    });
            //});
            //
            //socket.on('user-connected', (peerID) => {
            //    console.log('user-connected: ', peerID);
            //    //socket.emit('peer connected', peerID);
            //    GLOBAL.manager.connectWithNewPeer(peerID);
            //});
            //
            //socket.on('user-disconnected', (disconnectedUser) => {
            //    console.log('user-disconnected: ', disconnectedUser);
            //});
        });

        socket.on('user-connected', (newUser) => {
            console.log('user-connected: ', newUser);
            this.connectWithNewPeer(newUser);
        });

        socket.on('user-disconnected', (disconnectedUser) => {
            console.log('disconnectedUser: ', disconnectedUser);
        });


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
        if(newUser != this.peerID){
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