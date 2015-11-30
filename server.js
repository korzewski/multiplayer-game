var express = require('express');
var app = express();
var PeerServer = require('peer').PeerServer;

app.use(express.static( __dirname + '/build' ));

var expressServer = app.listen(3001);
var io = require('socket.io').listen(expressServer);

var peerServer = new PeerServer({ port: 9000, path: '/multiplayer' });
var allConnectedPeers = [];


peerServer.on('connection', function(peerID){
	allConnectedPeers.push( { peerID: peerID } );
	io.emit('user-connected', peerID);

	console.log('new user connected: ', peerID);
});

peerServer.on('disconnect', function(peerID){
	allConnectedPeers.forEach((peer, index) =>{
		if(peer.peerID == peerID){
			allConnectedPeers.splice(index, 1);
		}
	});
	io.emit('user-disconnected', peerID);

	console.log('user disconnected: ', peerID);
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});