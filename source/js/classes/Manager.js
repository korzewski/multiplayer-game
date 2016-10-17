import PubSub from 'pubsub-js';

let selfPeer,
    connectedPlayers = {},
    context,
    playerName;


export default class Manager {
    constructor(ctx){
        context = ctx;
        initEvents();
        context.game.state.start('Game');
    }

    broadcast(data) {
        for(const peerID in connectedPlayers){
            connectedPlayers[peerID].peer.send(data);
        };
    }

    sendSingleData(peer, data) {
        peer.send(data);
    }
}

function initIO(peerID) {
    // window.io = io();
    // window.io.on('rooms-list', onRoomsList);
    window.io.on('room-connected', onRoomConnected);
    window.io.on('player-joined-to-room', connectToPlayer);
    window.io.on('player-leave-a-room', disconnectPlayer);

    window.io.emit('new-player', peerID, playerName);

    console.log('--- initIO peerID: ', peerID);
}

function onRoomsList(rooms) {
    context.game.events.onRoomsList.dispatch(rooms);
}

function initServerConnection() {
    fetch('/getServerInfo').then((response) => {
        return response.json();
    }).then((data) => {
        createPeer(data);
    });
}

function createPeer(data) {
    if(data.env === 'production') {
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
        selfPeer = new Peer({host: '/', port: data.port, path: '/api'});
    }

    selfPeer.on('open', onPeerOpen);
    selfPeer.on('connection', onPlayerConnection);
}

function onPlayerConnection(conn) {
    function onPlayerData(data) {
        context.game.events.onUserDataUpdate.dispatch(conn.peer, data);
    }

    conn.on('data', onPlayerData);
}

function connectToPlayer(player) {
    if(selfPeer.id !== player.peerID){
        let conn = selfPeer.connect(player.peerID);

        function connectionReady() {
            connectedPlayers[player.peerID] = { peer: conn, playerName: player.playerName };
            context.game.events.onUserConnected.dispatch(connectedPlayers[player.peerID]);
        }
        
        conn.on('open', connectionReady);
    }
}

function disconnectPlayer(peerID) {
    const player = connectedPlayers[peerID];
    context.game.events.onUserDisconnected.dispatch(player);
    console.log('player disconnected: ', player);

    delete connectedPlayers[peerID];
    console.log('connectedPlayers: ', connectedPlayers);
}

function onPeerOpen(peerID) {
    initIO(peerID);
}

function onRoomConnected(roomPlayers) {
    context.game.state.start('Game');

    roomPlayers.forEach((player) => {
        connectToPlayer(player);
    });
}

function uiReady(msg, name) {
    playerName = name;
    initServerConnection();
}

function initEvents() {
    PubSub.subscribe('ui-ready', uiReady);
    PubSub.publish('manager-ready');

    context.game.connectedPlayers = connectedPlayers;

    context.game.events = context.game.events || {};
    context.game.events.onUserConnected = new Phaser.Signal();
    context.game.events.onUserDisconnected = new Phaser.Signal();
    context.game.events.onUserDataUpdate = new Phaser.Signal();
    context.game.events.onRoomsList = new Phaser.Signal();
}