var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var expressPeerServer = require('peer').ExpressPeerServer;

app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/build'));

var peerOptions = {
	debug: true
};

app.use('/api', expressPeerServer(server, peerOptions));

io.on('connection', function(socket){
	console.log('user connected');

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('test', (data) => {
		console.log('on test: ', data);
	});


	socket.emit('env', process.env.NODE_ENV, app.get('port'));
});

server.listen(app.get('port'), function(){
	console.log('Server running at localhost: ', app.get('port'));
});











//var peerServer = new PeerServer({ port: 443, path: '/peerjs' });
var allConnectedPeers = [];




//Websocket
//var WebSocketServer = require('ws').Server;
//var wss = new WebSocketServer( {'server': server} );
//
//wss.on('connection', function(ws){
//	console.log('ws connection');
//	ws.on('message', function(data){
//		// ...
//	});
//
//	ws.on('close', function(){
//		console.log('ws close');
//		// ...
//	});
//
//});

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

//app.get('/api/getServerPort', function(req, res){
//	return res.json( app.get('port') );
//});