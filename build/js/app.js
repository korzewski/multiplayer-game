(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesMenu = require('./classes/Menu');

var _classesMenu2 = _interopRequireDefault(_classesMenu);

var _classesGame = require('./classes/Game');

var _classesGame2 = _interopRequireDefault(_classesGame);

var _classesManager = require('./classes/Manager');

var _classesManager2 = _interopRequireDefault(_classesManager);

var Init = (function (_Phaser$Game) {
    _inherits(Init, _Phaser$Game);

    function Init() {
        _classCallCheck(this, Init);

        _get(Object.getPrototypeOf(Init.prototype), 'constructor', this).call(this, GLOBAL.width, GLOBAL.height, Phaser.AUTO, 'game');
        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('Menu', _classesMenu2['default'], false);
        this.state.add('Game', _classesGame2['default'], false);
        this.state.start('Boot');
    }

    return Init;
})(Phaser.Game);

var Boot = (function (_Phaser$State) {
    _inherits(Boot, _Phaser$State);

    function Boot() {
        _classCallCheck(this, Boot);

        _get(Object.getPrototypeOf(Boot.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Boot, [{
        key: 'create',
        value: function create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.maxWidth = 700;
                this.scale.maxHeight = 700;
            } else {
                // mobile settings
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 480;
                this.scale.minHeight = 260;
                this.scale.maxWidth = 1024;
                this.scale.maxHeight = 768;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.refresh();
            }

            this.game.state.start('Preloader', true, false);
        }
    }]);

    return Boot;
})(Phaser.State);

var Preloader = (function (_Phaser$State2) {
    _inherits(Preloader, _Phaser$State2);

    function Preloader() {
        _classCallCheck(this, Preloader);

        _get(Object.getPrototypeOf(Preloader.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Preloader, [{
        key: 'preload',
        value: function preload() {
            this.game.load.tilemap('level1', 'extra/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('level1-tiles', 'extra/maps/level1-tiles.png');
            this.game.load.image('player', 'extra/img/player.png');
            this.game.load.image('coin', 'extra/img/coin.png');
            this.game.load.image('bullet-1', 'extra/img/bullet-1.png');
            this.game.load.image('bullet-2', 'extra/img/bullet-2.png');
            this.game.load.spritesheet('explosion', 'extra/img/explosion.png', 64, 64);
        }
    }, {
        key: 'create',
        value: function create() {
            this.game.manager = new _classesManager2['default'](this);
        }
    }]);

    return Preloader;
})(Phaser.State);

new Init();

},{"./classes/Game":2,"./classes/Manager":3,"./classes/Menu":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _PeerPlayer = require('./PeerPlayer');

var _PeerPlayer2 = _interopRequireDefault(_PeerPlayer);

var Game = (function (_Phaser$State) {
    _inherits(Game, _Phaser$State);

    function Game() {
        _classCallCheck(this, Game);

        _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Game, [{
        key: 'create',
        value: function create() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = this.game.add.tilemap('level1');
            this.map.addTilesetImage('simples_pimples', 'level1-tiles');
            this.blockedLayer = this.map.createLayer('blocked');
            this.blockedLayer.resizeWorld();
            this.map.setCollisionBetween(1, 10000, true, 'blocked');

            this.coins = this.game.add.group();
            this.coins.enableBody = true;
            this.map.createFromObjects('money', 'mm', 'coin', 0, true, false, this.coins);

            this.player = new _Player2['default'](this.game, 80, 100, 'player', this.blockedLayer);
            this.game.camera.follow(this.player);

            // this.connectedPlayers = {};

            this.scores = 0;
            this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right' };
            this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
            this.scoresLabel.fixedToCamera = true;
            this.scoresLabel.cameraOffset.setTo(10, 10);

            this.healthLabel = this.game.add.text(0, 0, 'health: ' + this.player.health, this.textStyle);
            this.healthLabel.fixedToCamera = true;
            this.healthLabel.cameraOffset.setTo(10, 30);

            this.killsLabel = this.game.add.text(0, 0, 'kills: ' + this.player.kills, this.textStyle);
            this.killsLabel.fixedToCamera = true;
            this.killsLabel.cameraOffset.setTo(10, 50);

            this.game.events.onUserConnected.add(this.onUserConnected, this);
            this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
            this.game.events.onUserDisconnected.add(this.onUserDisconnected, this);

            this.game.events.onExplosion = new Phaser.Signal();
            this.game.events.onExplosion.add(this.addExplosion, this);
        }
    }, {
        key: 'onUserConnected',
        value: function onUserConnected(connectedPlayer) {
            connectedPlayer.gameObject = new _PeerPlayer2['default'](this.game, 80, 100, 'player', connectedPlayer, this.blockedLayer);

            this.game.manager.sendSingleData(connectedPlayer.peer, {
                type: 'updatePositionRequest'
            });
        }
    }, {
        key: 'onUserDisconnected',
        value: function onUserDisconnected(player) {
            this.game.events.onExplosion.dispatch(player.gameObject.x, player.gameObject.y, 1, 1);
            player.gameObject.destroy();
        }
    }, {
        key: 'onUserDataUpdate',
        value: function onUserDataUpdate(peerID, data) {
            if (data.type == 'position') {
                this.game.connectedPlayers[peerID].gameObject.updatePosition(data);
            } else if (data.type == 'shoot') {
                this.game.connectedPlayers[peerID].gameObject.shoot(data);
            } else if (data.type == 'damage') {
                this.player.addDamage(data, this.game.connectedPlayers[peerID]);
                this.healthLabel.text = 'health: ' + this.player.health;
            } else if (data.type == 'kill') {
                this.player.addKill();
                this.addPoints(100);
                this.killsLabel.text = 'kills: ' + this.player.kills;
                this.healthLabel.text = 'health: ' + this.player.health;
            } else if (data.type == 'updatePositionRequest') {
                this.player.onlineUpdate(true);
            }
        }
    }, {
        key: 'update',
        value: function update() {
            var _this = this;

            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

            for (var connectedPlayer in this.game.connectedPlayers) {
                this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject, this.player.bullets, function (player, bullet) {
                    _this.game.manager.sendSingleData(player.connectedPlayer.peer, {
                        type: 'damage',
                        damage: _this.player.maxDamage
                    });

                    _this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                    bullet.kill();
                });

                this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject.bullets, this.player, function (player, bullet) {
                    _this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                    bullet.kill();
                });

                for (var connectedPlayer2 in this.game.connectedPlayers) {
                    if (connectedPlayer != connectedPlayer2) {
                        this.game.physics.arcade.overlap(this.game.connectedPlayers[connectedPlayer].gameObject.bullets, this.game.connectedPlayers[connectedPlayer2].gameObject, function (player, bullet) {
                            _this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                            bullet.kill();
                        });
                    }
                }
            }
        }
    }, {
        key: 'collectCoin',
        value: function collectCoin(player, coin) {
            coin.kill();
            this.addPoints(10);
        }
    }, {
        key: 'addPoints',
        value: function addPoints(value) {
            this.scores += value;
            this.scoresLabel.text = 'scores: ' + this.scores;
        }
    }, {
        key: 'addExplosion',
        value: function addExplosion(x, y, maxScale, alpha) {
            var explosion = this.game.add.sprite(x, y, 'explosion');
            explosion.animations.add('walk');
            explosion.animations.play('walk', 45, false, true);
            explosion.anchor.setTo(0.5);
            explosion.alpha = alpha || 0.8;

            var randomScale = maxScale - this.game.rnd.frac() * 0.2;
            explosion.scale.setTo(randomScale);
        }
    }, {
        key: 'render',
        value: function render() {
            //this.game.debug.text('Active Bullets: ' + this.player.bullets.countLiving() + ' / ' + this.player.bullets.total, 10, 45);
            //this.game.debug.cameraInfo(this.game.camera, 32, 32);
            //this.game.debug.spriteCoords(this.player, 32, 500);
        }
    }]);

    return Game;
})(Phaser.State);

exports['default'] = Game;
module.exports = exports['default'];

},{"./PeerPlayer":5,"./Player":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var socket = undefined,
    selfPeer = undefined,
    connectedPlayers = {},
    context = undefined;

var Manager = (function () {
    function Manager(ctx) {
        _classCallCheck(this, Manager);

        context = ctx;
        initEvents();
        initServerConnection();
    }

    _createClass(Manager, [{
        key: 'updateRoomsList',
        value: function updateRoomsList() {
            socket.emit('get-rooms-list');
        }
    }, {
        key: 'joinRoom',
        value: function joinRoom(roomName) {
            socket.emit('join-room', roomName, context.game.playerName);
        }
    }, {
        key: 'broadcast',
        value: function broadcast(data) {
            for (var peerID in connectedPlayers) {
                connectedPlayers[peerID].peer.send(data);
            };
        }
    }, {
        key: 'sendSingleData',
        value: function sendSingleData(peer, data) {
            peer.send(data);
        }
    }]);

    return Manager;
})();

exports['default'] = Manager;

function initIO(peerID) {
    socket = io();
    socket.on('rooms-list', onRoomsList);
    socket.on('room-connected', onRoomConnected);
    socket.on('player-joined-to-room', connectToPlayer);
    socket.on('player-leave-a-room', disconnectPlayer);

    socket.emit('new-player', peerID, context.game.playerName);

    console.log('--- initIO peerID: ', peerID);
    context.game.state.start('Menu');
}

var onRoomsList = function onRoomsList(rooms) {
    context.game.events.onRoomsList.dispatch(rooms);
};

function initServerConnection() {
    fetch('/getServerInfo').then(function (response) {
        return response.json();
    }).then(function (data) {
        createPeer(data);
    });
}

function createPeer(data) {
    console.log('createPeer env: ' + data.env + ' port: ' + data.port);

    if (data.env === 'production') {
        selfPeer = new Peer({
            host: '/',
            secure: true,
            port: 443,
            key: 'peerjs',
            path: '/api',
            config: {
                'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]
            }
        });
    } else {
        selfPeer = new Peer({ host: '/', port: data.port, path: '/api' });
    }

    selfPeer.on('open', onPeerOpen);
    selfPeer.on('connection', onPlayerConnection);
}

function onPlayerConnection(conn) {
    function onPlayerData(data) {
        context.game.events.onUserDataUpdate.dispatch(conn.peer, data);
    }

    conn.on('data', onPlayerData);
}

function connectToPlayer(player) {
    if (selfPeer.id !== player.peerID) {
        (function () {
            var connectionReady = function connectionReady() {
                connectedPlayers[player.peerID] = { peer: conn, playerName: player.playerName };
                context.game.events.onUserConnected.dispatch(connectedPlayers[player.peerID]);
            };

            var conn = selfPeer.connect(player.peerID);

            conn.on('open', connectionReady);
        })();
    }
}

function disconnectPlayer(peerID) {
    var player = connectedPlayers[peerID];
    context.game.events.onUserDisconnected.dispatch(player);
    console.log('player disconnected: ', player);

    delete connectedPlayers[peerID];
    console.log('connectedPlayers: ', connectedPlayers);
}

function onPeerOpen(peerID) {
    console.log('peer: ', this);
    initIO(peerID);
}

function onRoomConnected(roomPlayers) {
    context.game.state.start('Game');

    roomPlayers.forEach(function (player) {
        connectToPlayer(player);
    });
}

// const onUserDisconnected = (user) => {
//     console.log('onUserDisconnected: ', user);
//     context.game.events.onUserDisconnected.dispatch(user);
// }

var initEvents = function initEvents() {
    setPlayerName();

    context.game.connectedPlayers = connectedPlayers;

    context.game.events = context.game.events || {};
    context.game.events.onUserConnected = new Phaser.Signal();
    context.game.events.onUserDisconnected = new Phaser.Signal();
    context.game.events.onUserDataUpdate = new Phaser.Signal();
    context.game.events.onRoomsList = new Phaser.Signal();
};

function setPlayerName() {
    context.game.playerName = '';
    while (context.game.playerName === '') {
        context.game.playerName = prompt('Please enter your name', localStorage.getItem('playerName') || '');
    }
    localStorage.setItem('playerName', context.game.playerName);
    console.log('playerName: ', context.game.playerName);
}
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fontStyle = { font: "bold 16px Arial", fill: "#fff" };

var Menu = (function (_Phaser$State) {
    _inherits(Menu, _Phaser$State);

    function Menu() {
        _classCallCheck(this, Menu);

        _get(Object.getPrototypeOf(Menu.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(Menu, [{
        key: "create",
        value: function create() {
            this.menuText = this.game.add.text(100, 30, 'rooms list', fontStyle);
            this.menuText.anchor.setTo(0, 0.5);

            this.updateText = this.game.add.text(this.game.width - 20, 30, 'update rooms', fontStyle);
            this.updateText.anchor.setTo(1, 0.5);
            this.updateText.inputEnabled = true;

            this.updateText.events.onInputDown.add(this.game.manager.updateRoomsList, this);
            this.game.events.onRoomsList.add(this.showRoomList, this);
        }
    }, {
        key: "showRoomList",
        value: function showRoomList(rooms) {
            if (this.roomsButtons) {
                this.roomsButtons.destroy();
            }

            this.roomsButtons = this.game.add.group();
            this.roomsButtons.position.setTo(100, 50);

            for (var i = 0; i < rooms.length; i++) {
                var button = this.game.add.text(0, i * 30, rooms[i].name + " [" + rooms[i].players.length + "]", fontStyle);
                button.inputEnabled = true;
                button.events.onInputDown.add(this.joinRoom.bind(this, rooms[i].name));
                this.roomsButtons.add(button);
            }
        }
    }, {
        key: "joinRoom",
        value: function joinRoom(roomName) {
            console.log('joinRoom: ', roomName);
            this.game.manager.joinRoom(roomName);
        }
    }]);

    return Menu;
})(Phaser.State);

exports["default"] = Menu;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PeerPlayer = (function (_Phaser$Sprite) {
    _inherits(PeerPlayer, _Phaser$Sprite);

    function PeerPlayer(game, posX, posY, spriteName, connectedPlayer, blockedLayer) {
        _classCallCheck(this, PeerPlayer);

        _get(Object.getPrototypeOf(PeerPlayer.prototype), "constructor", this).call(this, game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.connectedPlayer = connectedPlayer;
        this.blockedLayer = blockedLayer;

        this.anchor.setTo(0.5, 0.5);
        this.initBullets();
        this.initPlayerName();

        this.game.add.existing(this);
    }

    _createClass(PeerPlayer, [{
        key: "initPlayerName",
        value: function initPlayerName() {
            var textStyle = { font: "10px Arial", fill: "#fff" };
            var playerNameUI = this.game.add.text(this.width / 2, this.height, this.connectedPlayer.playerName, textStyle);
            playerNameUI.anchor.setTo(0.5);
            this.addChild(playerNameUI);
        }
    }, {
        key: "updatePosition",
        value: function updatePosition(data) {
            // if(data.posX > this.position.x){
            //     this.scale.x = -1;
            // } else {
            //     this.scale.x = 1;
            // }

            this.position.x = data.posX;
            this.position.y = data.posY;
        }
    }, {
        key: "initBullets",
        value: function initBullets() {
            this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
            this.bullets.createMultiple(10, 'bullet-2');
            this.bullets.forEach(function (bullet) {
                bullet.anchor.setTo(0.5);
                bullet.scale.setTo(0.9);
                bullet.smoothed = false;
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
            });
        }
    }, {
        key: "shoot",
        value: function shoot(data) {
            var dataPoint = new Phaser.Point(data.bullet.x, data.bullet.y);

            var bullet = this.bullets.getFirstDead();
            bullet.reset(dataPoint.x, dataPoint.y);

            var newPoint = Phaser.Point.rotate(new Phaser.Point(dataPoint.x + 10, dataPoint.y), dataPoint.x, dataPoint.y, data.bullet.angleDeg, true);
            this.game.physics.arcade.moveToXY(bullet, newPoint.x, newPoint.y, data.bullet.speed);
        }
    }, {
        key: "update",
        value: function update() {
            var _this = this;

            this.game.physics.arcade.collide(this.bullets, this.blockedLayer, function (bullet) {
                _this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.4);
                bullet.kill();
            });
        }
    }]);

    return PeerPlayer;
})(Phaser.Sprite);

exports["default"] = PeerPlayer;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (function (_Phaser$Sprite) {
    _inherits(Player, _Phaser$Sprite);

    function Player(game, posX, posY, spriteName, blockedLayer) {
        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;

        this.startPos = new Phaser.Point(posX, posY);

        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.blockedLayer = blockedLayer;

        this.initValues();
        this.initMovement();
        this.initBullets();

        this.lastOnlinePosition = new Phaser.Point(this.x, this.y);
        this.game.add.existing(this);
    }

    _createClass(Player, [{
        key: 'update',
        value: function update() {
            var _this = this;

            this.body.velocity.x = this.body.velocity.y = 0;

            if (this.cursors.right.isDown || this.cursorsWSAD.right.isDown) {
                this.body.velocity.x += this.speed;
                this.scale.x = -1;
            } else if (this.cursors.left.isDown || this.cursorsWSAD.left.isDown) {
                this.body.velocity.x -= this.speed;
                this.scale.x = 1;
            }

            if (this.cursors.down.isDown || this.cursorsWSAD.down.isDown) {
                this.body.velocity.y += this.speed;
            } else if (this.cursors.up.isDown || this.cursorsWSAD.up.isDown) {
                this.body.velocity.y -= this.speed;
            }

            this.game.physics.arcade.collide(this.bullets, this.blockedLayer, function (bullet) {
                _this.game.events.onExplosion.dispatch(bullet.x, bullet.y, 0.5);
                bullet.kill();
            });

            this.onlineUpdate();
        }
    }, {
        key: 'initValues',
        value: function initValues() {
            this.health = 100;
            this.maxDamage = 10;
            this.kills = 0;

            this.speed = 100;
            this.fireRate = 100;
            this.nextFire = 0;
            this.bulletSpeed = 200;
        }
    }, {
        key: 'initMovement',
        value: function initMovement() {
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.cursorsWSAD = {
                up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
            };
            this.game.input.onDown.add(this.fire, this);
        }
    }, {
        key: 'initBullets',
        value: function initBullets() {
            this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
            this.bullets.createMultiple(10, 'bullet-1');
            this.bullets.forEach(function (bullet) {
                bullet.anchor.setTo(0.5);
                bullet.scale.setTo(0.9);
                bullet.smoothed = false;
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
            });
        }
    }, {
        key: 'fire',
        value: function fire() {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.x, this.y);

                var shootAngleDeg = Phaser.Math.radToDeg(this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed));
                var shootInfo = {
                    angleDeg: shootAngleDeg,
                    speed: this.bulletSpeed,
                    x: parseInt(bullet.x),
                    y: parseInt(bullet.y)
                };

                this.game.manager.broadcast({
                    type: 'shoot',
                    bullet: shootInfo
                });
            }
        }
    }, {
        key: 'addKill',
        value: function addKill() {
            this.kills++;
        }
    }, {
        key: 'addDamage',
        value: function addDamage(data, connectedPlayer) {
            this.health -= data.damage;
            if (this.health <= 0) {
                this.gameOver(connectedPlayer);
            }
        }
    }, {
        key: 'gameOver',
        value: function gameOver(connectedPlayer) {
            console.log('killed by: ', connectedPlayer);
            this.game.manager.sendSingleData(connectedPlayer.peer, {
                type: 'kill'
            });

            this.resetPlayer();
        }
    }, {
        key: 'resetPlayer',
        value: function resetPlayer() {
            this.position.x = this.startPos.x;
            this.position.y = this.startPos.y;

            this.initValues();

            this.game.manager.broadcast({
                type: 'position',
                posX: parseInt(this.position.x),
                posY: parseInt(this.position.y)
            });
        }
    }, {
        key: 'onlineUpdate',
        value: function onlineUpdate(updatePositionRequest) {
            if (this.position.x != this.lastOnlinePosition.x || this.position.y != this.lastOnlinePosition.y || updatePositionRequest) {
                this.game.manager.broadcast({
                    type: 'position',
                    posX: parseInt(this.position.x),
                    posY: parseInt(this.position.y)
                });

                this.lastOnlinePosition = new Phaser.Point(this.position.x, this.position.y);
            }
        }
    }]);

    return Player;
})(Phaser.Sprite);

exports['default'] = Player;
module.exports = exports['default'];

},{}]},{},[1])


//# sourceMappingURL=app.js.map
