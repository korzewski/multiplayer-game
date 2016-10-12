"use strict";

let io,
    port,
    connectedUsers = [],
    rooms = [],
    lastPlayerID = 0;

const defaultRoom = 'menu-channel';

function onConnection(socket) {
    joinDefaultRoom.apply(socket);
    socket.playerID = lastPlayerID++;

    socket.on('get-rooms-list', sendRoomsList);
    socket.on('change-room', onChangeRoom);
    socket.on('disconnect', onDisconnect);
}

function onDisconnect() {
    console.log('onDisconnect player: ', this.playerName);
    console.log('onDisconnect room: ', this.room);
    leaveRoom.call(this, this.playerName);
}

function joinDefaultRoom() {
    console.log('--- joined default room: ', this.name);
    this.room = defaultRoom;
    this.join(defaultRoom);
}

function onChangeRoom(roomName, playerName) {
    if(this.room !== roomName) {
        leaveRoom.call(this, playerName);

        const newRoom = findArrayIndexByObjectProp(rooms, roomName, 'name');
        if(newRoom !== null) {
            joinRoom.call(this, newRoom, playerName);
            console.log('--- ', newRoom);
        } else {
            joinDefaultRoom.apply(this);
        }

        sendRoomsList();
    } else {
        console.log('you are already in room: ', roomName);
    }
}

function joinRoom(newRoom, playerName) {
    this.join(newRoom.name);
    this.room = newRoom.name;
    this.playerName = playerName;

    newRoom.players.push({ id: this.playerID, name: this.playerName });
    console.log(this.playerName + ' joined to ' + this.room);

    this.emit('room-connected', process.env.NODE_ENV, port, newRoom.players);
}

function leaveRoom(playerName) {
    this.leave(this.room);
    const room = findArrayIndexByObjectProp(rooms, this.room, 'name');
    if(room !== null) {
        console.log('leave ID: ', this.playerID);
        const playerIndex = findArrayIndexByObjectProp(room.players, this.playerID, 'id');

        if(playerIndex) {
            room.players.splice(playerIndex, 1);
            console.log(playerName + ' leave ' + this.room + ' -> ', room.players);
            this.room = '';
        }
    }
}

function findArrayIndexByObjectProp(array, query, prop) {
    for(let i = 0; i < array.length; i++) {
        if(query === array[i][prop]) {
            return array[i];
        }
    }

    return null;
}

function onPeerConnect(peerID){
    connectedUsers.push({ peerID });
    io.emit('peer-connected', peerID, 'name', 'id');

    console.log('onPeerConnect: ', peerID);
}

function onPeerDisconnect(peerID) {
    connectedUsers.forEach((peer, index) => {
        if(peer.peerID === peerID){
            connectedUsers.splice(index, 1);
        }
    });

    io.emit('user-disconnected', peerID);
}

function createRoom(name) {
    rooms.push({ name, players: [] });
}

function sendRoomsList() {
    io.to(defaultRoom).emit('rooms-list', rooms);
}

module.exports = {
    init: (app, server) => {
        io = require('socket.io')(server);

        const expressPeerServer = require('peer').ExpressPeerServer,
        peerServer = expressPeerServer(server, {debug: false});

        app.use('/api', peerServer);
        port = app.get('port');

        io.on('connection', onConnection);
        peerServer.on('connection', onPeerConnect);
        peerServer.on('disconnect', onPeerDisconnect);

        const initRooms = ['red', 'green', 'blue'];
        for(let i = 0; i < initRooms.length; i++) {
            createRoom(initRooms[i]);
        }
    }
}