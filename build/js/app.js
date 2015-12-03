(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesLevel1 = require('./classes/Level1');

var _classesLevel12 = _interopRequireDefault(_classesLevel1);

var _classesManager = require('./classes/Manager');

var _classesManager2 = _interopRequireDefault(_classesManager);

var Init = (function (_Phaser$Game) {
    _inherits(Init, _Phaser$Game);

    function Init() {
        _classCallCheck(this, Init);

        _get(Object.getPrototypeOf(Init.prototype), 'constructor', this).call(this, GLOBAL.width, GLOBAL.height, Phaser.AUTO, 'game');
        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('Level1', _classesLevel12['default'], false);
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
        }
    }, {
        key: 'create',
        value: function create() {
            GLOBAL.game = this.game;
            GLOBAL.manager = new _classesManager2['default']();
            this.game.state.start('Level1');
        }
    }]);

    return Preloader;
})(Phaser.State);

new Init();

},{"./classes/Level1":2,"./classes/Manager":3}],2:[function(require,module,exports){
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

var Level1 = (function (_Phaser$State) {
    _inherits(Level1, _Phaser$State);

    function Level1() {
        _classCallCheck(this, Level1);

        _get(Object.getPrototypeOf(Level1.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Level1, [{
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

            this.player = new _Player2['default'](this.game, 80, 100, 'player');
            this.game.camera.follow(this.player);

            this.connectedPlayers = {};

            this.scores = 0;
            this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right' };
            this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
            this.scoresLabel.fixedToCamera = true;
            this.scoresLabel.cameraOffset.setTo(10, 10);

            this.game.events.onUserConnected.add(this.onUserConnected, this);
            this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
        }
    }, {
        key: 'onUserConnected',
        value: function onUserConnected(conn) {
            if (conn.peer != GLOBAL.manager.nickname) {
                this.connectedPlayers[conn.peer] = new _PeerPlayer2['default'](this.game, 200, 100, 'player', conn);
                console.log('connectedPlayers: ', this.connectedPlayers);
            }
        }
    }, {
        key: 'onUserDataUpdate',
        value: function onUserDataUpdate(peerName, data) {
            //console.log('onUserDataUpdate peerName: ', peerName);
            //console.log('onUserDataUpdate data: ', data);
            //
            //console.log('this.connectedPlayers: ', this.connectedPlayers);
            this.connectedPlayers[peerName].updatePosition(data);
        }
    }, {
        key: 'update',
        value: function update() {
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
        }
    }, {
        key: 'collectCoin',
        value: function collectCoin(player, coin) {
            coin.kill();
            this.addPoints();
        }
    }, {
        key: 'addPoints',
        value: function addPoints() {
            this.scores += 10;
            this.scoresLabel.text = 'scores: ' + this.scores;
        }

        //render() {
        //    this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //    this.game.debug.spriteCoords(this.player, 32, 500);
        //}
    }]);

    return Level1;
})(Phaser.State);

exports['default'] = Level1;
module.exports = exports['default'];

},{"./PeerPlayer":4,"./Player":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Manager = (function () {
    function Manager() {
        var _this = this;

        _classCallCheck(this, Manager);

        if (!GLOBAL.game.events) GLOBAL.game.events = {};
        GLOBAL.game.events.onUserConnected = new Phaser.Signal();
        GLOBAL.game.events.onUserDataUpdate = new Phaser.Signal();

        this.connectedPeers = [];

        var socket = io();
        socket.on('env', function (env, port, allConnectedPeers) {
            console.log('env: ', env);
            console.log('port: ', port);
            console.log('allConnectedPeers: ', allConnectedPeers);

            if (env === 'production') {
                _this.peer = new Peer({
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
                _this.peer = new Peer({ host: '/', port: port, path: '/api' });
                console.log('peer: ', _this.peer);
            }

            _this.peerID = _this.peer.peer;
            allConnectedPeers.forEach(function (peerObject) {
                _this.connectWithNewPeer(peerObject.peerID);
            });

            _this.peer.on('connection', function (conn) {
                console.log('peer on connection: ', conn);
                conn.on('open', function () {
                    conn.on('data', function (data) {
                        if (conn.peer != _this.nickname) {
                            GLOBAL.game.events.onUserDataUpdate.dispatch(conn.peer, data);
                        }
                    });
                });
            });
        });

        socket.on('user-connected', function (newUser) {
            console.log('user-connected: ', newUser);
            _this.connectWithNewPeer(newUser);
        });

        socket.on('user-disconnected', function (disconnectedUser) {
            console.log('user-disconnected: ', disconnectedUser);
        });
    }

    _createClass(Manager, [{
        key: 'connectWithNewPeer',
        value: function connectWithNewPeer(newUser) {
            var _this2 = this;

            if (newUser != this.peerID) {
                (function () {
                    console.log('connectWithNewPeer: ', newUser);
                    var conn = _this2.peer.connect(newUser);
                    conn.on('open', function () {
                        _this2.connectedPeers.push(conn);
                        GLOBAL.game.events.onUserConnected.dispatch(conn);
                    });
                })();
            }
        }
    }, {
        key: 'broadcast',
        value: function broadcast(data) {
            this.connectedPeers.forEach(function (peer, index) {
                peer.send(data);
            });
        }
    }]);

    return Manager;
})();

exports['default'] = Manager;
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

var PeerPlayer = (function (_Phaser$Sprite) {
    _inherits(PeerPlayer, _Phaser$Sprite);

    function PeerPlayer(game, posX, posY, spriteName, peer) {
        _classCallCheck(this, PeerPlayer);

        _get(Object.getPrototypeOf(PeerPlayer.prototype), "constructor", this).call(this, game, posX, posY, spriteName);

        this.peer = peer;

        this.game.physics.arcade.enable(this);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    _createClass(PeerPlayer, [{
        key: "updatePosition",
        value: function updatePosition(data) {
            this.position.x = data.posX;
            this.position.y = data.posY;
            //console.log('updatePosition: ', updatePosition);
        }
    }, {
        key: "getNickname",
        value: function getNickname() {
            return this.peer.peer;
        }
    }]);

    return PeerPlayer;
})(Phaser.Sprite);

exports["default"] = PeerPlayer;
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

var Player = (function (_Phaser$Sprite) {
    _inherits(Player, _Phaser$Sprite);

    function Player(game, posX, posY, spriteName) {
        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), "constructor", this).call(this, game, posX, posY, spriteName);
        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;

        this.speed = 100;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        //this.onlineLatencyMax = 100;
        //this.onlineLatency = this.onlineLatencyMax;
    }

    _createClass(Player, [{
        key: "update",
        value: function update() {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.cursors.right.isDown) {
                this.body.velocity.x += this.speed;
                this.scale.x = -1;
            } else if (this.cursors.left.isDown) {
                this.body.velocity.x -= this.speed;
                this.scale.x = 1;
            }

            if (this.cursors.down.isDown) {
                this.body.velocity.y += this.speed;
            } else if (this.cursors.up.isDown) {
                this.body.velocity.y -= this.speed;
            }

            this.onlineUpdate();
        }
    }, {
        key: "onlineUpdate",
        value: function onlineUpdate() {
            //if(--this.onlineLatency < 0){
            //    this.onlineLatency = this.onlineLatencyMax;
            GLOBAL.manager.broadcast({
                posX: parseInt(this.position.x),
                posY: parseInt(this.position.y)
            });
            //}
        }
    }]);

    return Player;
})(Phaser.Sprite);

exports["default"] = Player;
module.exports = exports["default"];

},{}]},{},[1])


//# sourceMappingURL=app.js.map
