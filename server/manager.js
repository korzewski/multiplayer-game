let io,
    port,
    connectedUsers = [];

const onConnection = (socket) => {
    socket.emit('env', process.env.NODE_ENV, port, connectedUsers);
}

const onPeerConnect = (peerID) => {
    connectedUsers.push({ peerID });
    io.emit('user-connected', peerID);
}

const onPeerDisconnect = (peerID) => {
    connectedUsers.forEach((peer, index) => {
        if(peer.peerID === peerID){
            connectedUsers.splice(index, 1);
        }
    });

    io.emit('user-disconnected', peerID);
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
    },
}