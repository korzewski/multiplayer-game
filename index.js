var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.set('port', (process.env.PORT || 5000));

app.use(express.static( __dirname + '/build' ));

var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

//var server = require('http').createServer(app);
//var options = {
//	debug: true
//};
//app.use('/api', ExpressPeerServer(server, options));


server.listen( app.get('port') );

//var io = require('socket.io').listen(server);


//var peerServer = new PeerServer({ port: 443, path: '/peerjs' });
var allConnectedPeers = [];


//Websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( {'server': server} );

wss.on('connection', function(ws){
	console.log('ws connection');
	ws.on('message', function(data){
		// ...
	});

	ws.on('close', function(){
		console.log('ws close');
		// ...
	});

});

//server.on('connection', function(peerID){
//	allConnectedPeers.push( { peerID: peerID } );
//	//io.emit('user-connected', peerID);
//
//	console.log('new user connected: ', peerID);
//});
//
//server.on('disconnect', function(peerID){
//	allConnectedPeers.forEach((peer, index) =>{
//		if(peer.peerID == peerID){
//			allConnectedPeers.splice(index, 1);
//		}
//	});
//	//io.emit('user-disconnected', peerID);
//
//	console.log('user disconnected: ', peerID);
//});

app.get('/', function(req, res){
	res.sendFile( __dirname + '/build/index.html' );
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});

app.get('/api/getServerPort', function(req, res){
	return res.json( app.get('port') );
});