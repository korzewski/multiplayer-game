var express = require('express');
var app = express();
var PeerServer = require('peer').PeerServer;

//var allowCrossDomain = function(req, res, next) {
//	res.header('Access-Control-Allow-Origin', '*');
//	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//
//	// intercept OPTIONS method
//	if ('OPTIONS' == req.method) {
//		res.send(200);
//	}
//	else {
//		next();
//	}
//};
//
//app.use(allowCrossDomain);

app.set('port', (process.env.PORT || 5000));

var op = require('openport');
op.find(
		{
			startingPort: 1024,
			endingPort: 2000,
			avoid: [ 1025, 1500 ]
		},
		function(err, port) {
			if(err) { console.log(err); return; }
			console.log('--------------- open port: ', port);
			// yea! we have an open port between 1024 and 2000, but not port 1025 or 1500.
		}
);

app.use(express.static( __dirname + '/build' ));

var expressServer = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

//var io = require('socket.io').listen(expressServer);

var peerServer = new PeerServer({ port: 9000 });
var allConnectedPeers = [];

peerServer.on('connection', function(peerID){
	allConnectedPeers.push( { peerID: peerID } );
	//io.emit('user-connected', peerID);

	console.log('new user connected: ', peerID);
});

peerServer.on('disconnect', function(peerID){
	allConnectedPeers.forEach((peer, index) =>{
		if(peer.peerID == peerID){
			allConnectedPeers.splice(index, 1);
		}
	});
	//io.emit('user-disconnected', peerID);

	console.log('user disconnected: ', peerID);
});

app.get('/', function(req, res){
	res.sendFile( __dirname + '/build/index.html' );
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});

app.get('/api/getCurrentPort', function(req, res){
	return res.json( app.get('port') );
});