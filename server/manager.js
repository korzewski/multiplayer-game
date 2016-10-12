"use strict";

let io,
    allConnectedPlayers = [],
    rooms = [];

const defaultRoom = 'menu-channel';

module.exports = {
    init: (app, server) => {
        io = require('socket.io')(server);
        io.on('connection', onConnection);

        const expressPeerServer = require('peer').ExpressPeerServer,
        peerServer = expressPeerServer(server, {debug: false});
        app.use('/api', peerServer);

        const initRooms = [defaultRoom, 'red', 'green', 'blue'];
        for(let i = 0; i < initRooms.length; i++) {
            createRoom(initRooms[i]);
        }
    }
}

function onConnection(socket) {
    socket.on('new-player', createNewPlayer);
    socket.on('get-rooms-list', sendRoomsList);
    socket.on('join-room', joinRoom);
    socket.on('disconnect', onDisconnect);
}

function createNewPlayer(peerID, playerName) {
    this.peerID = peerID;
    this.playerName = playerName;
    const newPlayer = { peerID, playerName };
    allConnectedPlayers.push(newPlayer);

    joinRoom.call(this, defaultRoom);
}

function joinRoom(roomName) {
    if(this.room !== roomName) {
        removeFromRoom.call(this);

        const roomIndex = findArrayIndexByObjectProp(rooms, roomName, 'name');
        if(roomIndex !== null) {
            const newRoom = rooms[roomIndex];
            this.join(newRoom.name);
            this.room = newRoom.name;

            newRoom.players.push({ peerID: this.peerID, name: this.playerName });
            console.log(this.playerName + ' joined to ' + newRoom.name);
            console.log(newRoom.name + ' players: ', newRoom.players);

            if(roomName !== defaultRoom) {
                this.emit('room-connected', newRoom.players);
            }
        }

        sendRoomsList();
    }
}

function removePlayer() {
    const playerIndex = findArrayIndexByObjectProp(allConnectedPlayers, this.peerID, 'peerID');
    if(playerIndex !== null) {
        allConnectedPlayers.splice(playerIndex, 1);
    }

    removeFromRoom.call(this);
}

function removeFromRoom() {
    const roomIndex = findArrayIndexByObjectProp(rooms, this.room, 'name');
    if(roomIndex !== null) {
        const roomPlayers = rooms[roomIndex].players;
        const playerIndexInRoom = findArrayIndexByObjectProp(roomPlayers, this.peerID, 'peerID');

        if(playerIndexInRoom !== null) {
            roomPlayers.splice(playerIndexInRoom, 1);
        }
        
        console.log(this.playerName + ' left ' + rooms[roomIndex].name);
        console.log(rooms[roomIndex].name + ' players: ', roomPlayers);
    }

    this.leave(this.room);
    this.room = defaultRoom;
}

function onDisconnect() {
    removePlayer.call(this);
}

function findArrayIndexByObjectProp(array, query, prop) {
    for(let i = 0; i < array.length; i++) {
        if(query === array[i][prop]) {
            return i;
        }
    }

    return null;
}

function createRoom(name) {
    rooms.push({ name, players: [] });
}

function sendRoomsList() {
    io.to(defaultRoom).emit('rooms-list', rooms);
}