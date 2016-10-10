let selfPeer,
    connectedPeers = [];

const onServerDetails = (env, port, roomPeers) => {
    console.log(`env: ${env} | port: ${port}`);
    console.log('roomPeers: ', roomPeers);

    if(env === 'production') {
        selfPeer = new Peer({
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
        selfPeer = new Peer({host: '/', port: port, path: '/api'});
        console.log('selfPeer: ', selfPeer);
    }

    roomPeers.forEach((peer) => {
        connectToPeer(peer.peerID);
    });

    selfPeer.on('connection', onConnection);
}

const onConnection = (conn) => {
    conn.on('open', () => {
        conn.on('data', (data) => {
            GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
        });
    });
}

const connectToPeer = (peerID) =>{
    if(peerID != selfPeer.peer){
        let conn = selfPeer.connect(peerID);
        conn.on('open', () => {
            connectedPeers.push(conn);
            GLOBAL.game.events.onUserConnected.dispatch(conn);
        });
    }
}

const onUserConnected = (user) => {
    console.log('onUserConnected: ', user);
    connectToPeer(user);
}

const onUserDisconnected = (user) => {
    console.log('onUserDisconnected: ', user);
    GLOBAL.game.events.onUserDisconnected.dispatch(user);
}

const initEvents = () => {
    GLOBAL.game.events = GLOBAL.game.events || {};
    GLOBAL.game.events.onUserConnected = new Phaser.Signal();
    GLOBAL.game.events.onUserDisconnected = new Phaser.Signal();
    GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();
    GLOBAL.game.events.onExplosion = new Phaser.Signal();
}

export default class Manager {
    constructor(){
        initEvents();

        const socket = io();
        socket.on('env', onServerDetails);
        socket.on('user-connected', onUserConnected);
        socket.on('user-disconnected', onUserDisconnected);
    }

    broadcast(data) {
        connectedPeers.forEach((peer) => {
            peer.send(data);
        });
    }

    sendSingleData(peer, data) {
        peer.send(data);
    }

    getConnectedPeers() {
        return connectedPeers;
    }
}

