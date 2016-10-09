let connectedPeer,
    connectedPeers = [];

const socketInit = (env, port, allConnectedPeers) => {
    console.log('env: ', env);
    console.log('port: ', port);
    console.log('allConnectedPeers: ', allConnectedPeers);

    if (env === 'production'){
        connectedPeer = new Peer({
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
        connectedPeer = new Peer({host: '/', port: port, path: '/api'});
        console.log('self connectedPeer: ', connectedPeer);
    }

    allConnectedPeers.forEach((peer) => {
        connectWithNewPeer(peer.peerID);
    });

    connectedPeer.on('connection', onConnection);
};

const onConnection = (conn) => {
    conn.on('open', () => {
        conn.on('data', (data) => {
            GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
        });
    });
};

const connectWithNewPeer = (newPeerID) =>{
    if(newPeerID != connectedPeer.peer){
        let conn = connectedPeer.connect(newPeerID);
        conn.on('open', () => {
            connectedPeers.push(conn);
            GLOBAL.game.events.onUserConnected.dispatch(conn);
        });
    }
};

const onUserConnected = (newUser) => {
    console.log('onUserConnected: ', newUser);
    connectWithNewPeer(newUser);
}

export default class Manager{
    constructor(){
        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDisconnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();
        GLOBAL.game.events.onExplosion = new Phaser.Signal();

        var socket = io();
        socket.on('env', socketInit);

        socket.on('user-connected', onUserConnected);

        socket.on('user-disconnected', (disconnectedUser) => {
            console.log('user-disconnected: ', disconnectedUser);
            GLOBAL.game.events.onUserDisconnected.dispatch(disconnectedUser);
        });
    }

    broadcast(data) {
        connectedPeers.forEach((peer) => {
            peer.send(data);
        });
    }

    sendSingleData(peer, data) {
        peer.send(data);
    }
}

