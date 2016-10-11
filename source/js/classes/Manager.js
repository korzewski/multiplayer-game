let socket,
    selfPeer,
    connectedPeers = [],
    context;

const onRoomsList = (rooms) => {
    context.game.events.onRoomsList.dispatch(rooms);
}

const onRoomConnected = (env, port) => {
    context.game.state.start('Game');
    console.log(`env: ${env} | port: ${port}`);

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
        console.log('--- selfPeer: ', selfPeer);
    }

    // roomPeers.forEach((peer) => {
    //     connectToPeer(peer.peerID);
    // });

    // selfPeer.on('connection', onConnection);
}

const onConnection = (conn) => {
    conn.on('open', () => {
        conn.on('data', (data) => {
            context.game.events.onUserDataUpdate.dispatch(conn.peer, data);
        });
    });
}

const connectToPeer = (peerID) => {
    console.log('connectedPeers selfPeer: ', selfPeer);
    if(selfPeer.peer !== peerID){
        let conn = selfPeer.connect(peerID);
        console.log('connect to peer: ', peerID);
        conn.on('open', () => {
            connectedPeers.push(conn);
            console.log('---- dispatch');
            context.game.events.onUserConnected.dispatch(conn);
        });
    }
}

const onPeerConnected = (peerID) => {
    // console.log('onUserConnected: ', user);
    // connectToPeer(user);

    roomPeers.forEach((peer) => {
        connectToPeer(peer.peerID);
    });

    selfPeer.on('connection', onConnection);
}

const onUserDisconnected = (user) => {
    console.log('onUserDisconnected: ', user);
    context.game.events.onUserDisconnected.dispatch(user);
}

const initEvents = () => {
    context.game.playerName = '';
    while(context.game.playerName === '') {
        context.game.playerName = prompt('Please enter your name', localStorage.getItem('playerName') || '');
    }
    localStorage.setItem('playerName', context.game.playerName);
    console.log('playerName: ', context.game.playerName);

    context.game.events = context.game.events || {};
    context.game.events.onUserConnected = new Phaser.Signal();
    context.game.events.onUserDisconnected = new Phaser.Signal();
    context.game.events.onUserDataUpdate = new Phaser.Signal();
    context.game.events.onExplosion = new Phaser.Signal();
    context.game.events.onRoomsList = new Phaser.Signal();
}

export default class Manager {
    constructor(ctx){
        context = ctx;
        initEvents(context);
    }

    connect() {
        socket = io();
        socket.on('rooms-list', onRoomsList);
        socket.on('room-connected', onRoomConnected);
        socket.on('peer-connected', onPeerConnected);
        socket.on('user-disconnected', onUserDisconnected);
    }

    updateRoomsList() {
        socket.emit('get-rooms-list');
    }

    changeRoom(roomName) {
        socket.emit('change-room', roomName, context.game.playerName);
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

