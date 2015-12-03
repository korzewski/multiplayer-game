var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var expressPeerServer = require('peer').ExpressPeerServer;

app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/build'));

var peerOptions = {
	//debug: true
};
var peerServer = expressPeerServer(server, peerOptions);
app.use('/api', peerServer);


var allConnectedPeers = [];

// send configuration to client
io.on('connection', function(socket){
	socket.emit('env', process.env.NODE_ENV, app.get('port'));
});

// client peer is created
peerServer.on('connection', function(peerID){
	allConnectedPeers.push( { peerID: peerID } );
	io.emit('user-connected', peerID);

	console.log('new user connected: ', peerID);
});

// client peer is removed
peerServer.on('disconnect', function(peerID){
	allConnectedPeers.forEach((peer, index) =>{
		if(peer.peerID == peerID){
			allConnectedPeers.splice(index, 1);
		}
	});
	io.emit('user-disconnected', peerID);

	console.log('user disconnect: ', peerID);
});

server.listen(app.get('port'), function(){
	console.log('Server running at localhost: ', app.get('port'));
});

app.get('/', function(req, res){
	res.sendFile( __dirname + '/build/index.html' );
});

app.get('/api/allConnectedPeers', function(req, res){
	return res.json(allConnectedPeers);
});