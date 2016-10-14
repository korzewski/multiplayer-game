let socket,
    selfPeer,
    connectedPlayers = {},
    context;

export default class Manager {
    constructor(ctx){
        context = ctx;
        initEvents();
        initServerConnection();
    }

    updateRoomsList() {
        socket.emit('get-rooms-list');
    }

    joinRoom(roomName) {
        socket.emit('join-room', roomName, context.game.playerName);
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
    socket = io();
    socket.on('rooms-list', onRoomsList);
    socket.on('room-connected', onRoomConnected);
    socket.on('player-joined-to-room', connectToPlayer);
    socket.on('player-leave-a-room', disconnectPlayer);

    socket.emit('new-player', peerID, context.game.playerName);

    console.log('--- initIO peerID: ', peerID);
    context.game.state.start('Menu');
}

const onRoomsList = (rooms) => {
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
    console.log('createPeer env: ' + data.env + ' port: ' + data.port);

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
    console.log('peer: ', this);
    initIO(peerID);
}

function onRoomConnected(roomPlayers) {
    context.game.state.start('Game');

    roomPlayers.forEach((player) => {
        connectToPlayer(player);
    });
}

// const onUserDisconnected = (user) => {
//     console.log('onUserDisconnected: ', user);
//     context.game.events.onUserDisconnected.dispatch(user);
// }

const initEvents = () => {
    setPlayerName();

    context.game.connectedPlayers = connectedPlayers;

    context.game.events = context.game.events || {};
    context.game.events.onUserConnected = new Phaser.Signal();
    context.game.events.onUserDisconnected = new Phaser.Signal();
    context.game.events.onUserDataUpdate = new Phaser.Signal();
    context.game.events.onRoomsList = new Phaser.Signal();
}

function setPlayerName() {
    context.game.playerName = '';
    while(context.game.playerName === '') {
        context.game.playerName = prompt('Please enter your name', localStorage.getItem('playerName') || '');
    }
    localStorage.setItem('playerName', context.game.playerName);
    console.log('playerName: ', context.game.playerName);
}
