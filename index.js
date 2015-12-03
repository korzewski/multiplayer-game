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


var allConnectedPeers = [];

io.on('connection', function(socket){
	socket.emit('env', process.env.NODE_ENV, app.get('port'));

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('peer connected', (data) => {
		console.log('peer connected: ', data);
		allConnectedPeers.push( { peerID: data } );

		socket.emit('peer connected', data);
	});

	socket.on('peer disconnected', (data) => {
		allConnectedPeers.forEach((peer, index) =>{
			if(peer.peerID == data){
				allConnectedPeers.splice(index, 1);
			}
		});

		socket.emit('peer disconnected', data);
	});

});

server.listen(app.get('port'), function(){
	console.log('Server running at localhost: ', app.get('port'));
});











//var peerServer = new PeerServer({ port: 443, path: '/peerjs' });


//server.on('connection', function(peerID){
//	allConnectedPeers.push( { peerID: peerID } );
//	io.emit('user-connected', peerID);
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
//	io.emit('user-disconnected', peerID);
//
//	console.log('user disconnected: ', peerID);
//});

app.get('/', function(req, res){
	res.sendFile( __dirname + '/build/index.html' );
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});