var express = require('express');
var app = express();
var PeerServer = require('peer').PeerServer;
var path = require('path');

app.set('port', (process.env.PORT || 5000));

app.use(express.static( __dirname + '/build' ));

var expressServer = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

//var expressServer = app.listen( app.get('port') );
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

app.get('/', function(req, res){
	res.sendFile( __dirname + '/build/index.html' );
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});