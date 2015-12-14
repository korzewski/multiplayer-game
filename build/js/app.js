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
            this.game.load.image('bullet-1', 'extra/img/bullet-1.png');
            this.game.load.image('bullet-2', 'extra/img/bullet-2.png');
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

            this.player = new _Player2['default'](this.game, 80, 100, 'player', this.blockedLayer);
            this.game.camera.follow(this.player);

            this.connectedPlayers = {};

            this.scores = 0;
            this.textStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: 'right', align: 'right' };
            this.scoresLabel = this.game.add.text(0, 0, 'scores: 0', this.textStyle);
            this.scoresLabel.fixedToCamera = true;
            this.scoresLabel.cameraOffset.setTo(10, 10);

            this.game.events.onUserConnected.add(this.onUserConnected, this);
            this.game.events.onUserDataUpdate.add(this.onUserDataUpdate, this);
            this.game.events.onUserDisconnected.add(this.onUserDisconnected, this);
        }
    }, {
        key: 'onUserConnected',
        value: function onUserConnected(conn) {
            if (conn.peer != GLOBAL.manager.nickname) {
                this.connectedPlayers[conn.peer] = new _PeerPlayer2['default'](this.game, 200, 100, 'player', conn, this.blockedLayer);
            }
        }
    }, {
        key: 'onUserDisconnected',
        value: function onUserDisconnected(userName) {
            this.connectedPlayers[userName].destroy();
            delete this.connectedPlayers[userName];
        }
    }, {
        key: 'onUserDataUpdate',
        value: function onUserDataUpdate(peerName, data) {
            if (data.type == 'position') {
                this.connectedPlayers[peerName].updatePosition(data);
            } else if (data.type == 'shoot') {
                this.connectedPlayers[peerName].shoot(data);
            } else if (data.type == 'damage') {
                this.player.addDamage(data);
            }
        }
    }, {
        key: 'update',
        value: function update() {
            var _this = this;

            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

            for (var connectedPlayer in this.connectedPlayers) {
                this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer], this.player.bullets, function (connPlayer, bullet) {
                    GLOBAL.manager.sendSingleData(connPlayer.peer, {
                        type: 'damage',
                        damage: _this.player.maxDamage
                    });
                    bullet.kill();
                });

                this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer].bullets, this.player, function (connPlayer, bullet) {
                    bullet.kill();
                });

                for (var connectedPlayer2 in this.connectedPlayers) {
                    if (connectedPlayer != connectedPlayer2) {
                        this.game.physics.arcade.overlap(this.connectedPlayers[connectedPlayer].bullets, this.connectedPlayers[connectedPlayer2], function (connectedPlayer, bullet) {
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
            this.addPoints();
        }
    }, {
        key: 'addPoints',
        value: function addPoints() {
            this.scores += 10;
            this.scoresLabel.text = 'scores: ' + this.scores;
        }
    }, {
        key: 'render',
        value: function render() {
            //this.game.debug.text('Active Bullets: ' + this.player.bullets.countLiving() + ' / ' + this.player.bullets.total, 10, 45);
            //this.game.debug.cameraInfo(this.game.camera, 32, 32);
            //this.game.debug.spriteCoords(this.player, 32, 500);
        }
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
        GLOBAL.game.events.onUserDisconnected = new Phaser.Signal();
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
            GLOBAL.game.events.onUserDisconnected.dispatch(disconnectedUser);
        });
    }

    _createClass(Manager, [{
        key: 'connectWithNewPeer',
        value: function connectWithNewPeer(newUser) {
            var _this2 = this;

            if (newUser != this.peerID) {
                (function () {
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
    }, {
        key: 'sendSingleData',
        value: function sendSingleData(peer, data) {
            peer.send(data);
        }
    }]);

    return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PeerPlayer = (function (_Phaser$Sprite) {
    _inherits(PeerPlayer, _Phaser$Sprite);

    function PeerPlayer(game, posX, posY, spriteName, peer, blockedLayer) {
        _classCallCheck(this, PeerPlayer);

        _get(Object.getPrototypeOf(PeerPlayer.prototype), 'constructor', this).call(this, game, posX, posY, spriteName);

        this.peer = peer;

        this.game.physics.arcade.enable(this);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        this.blockedLayer = blockedLayer;

        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(5, 'bullet-2');
        this.bullets.forEach(function (bullet) {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });
    }

    _createClass(PeerPlayer, [{
        key: 'updatePosition',
        value: function updatePosition(data) {
            this.position.x = data.posX;
            this.position.y = data.posY;
        }
    }, {
        key: 'shoot',
        value: function shoot(data) {
            var dataPoint = new Phaser.Point(data.bullet.x, data.bullet.y);

            var bullet = this.bullets.getFirstDead();
            bullet.reset(dataPoint.x, dataPoint.y);

            var newPoint = Phaser.Point.rotate(new Phaser.Point(dataPoint.x + 10, dataPoint.y), dataPoint.x, dataPoint.y, data.bullet.angleDeg, true);
            this.game.physics.arcade.moveToXY(bullet, newPoint.x, newPoint.y, data.bullet.speed);
        }
    }, {
        key: 'getNickname',
        value: function getNickname() {
            return this.peer.peer;
        }
    }, {
        key: 'update',
        value: function update() {
            this.game.physics.arcade.collide(this.bullets, this.blockedLayer, function (bullet) {
                bullet.kill();
            });
        }
    }]);

    return PeerPlayer;
})(Phaser.Sprite);

exports['default'] = PeerPlayer;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
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

        this.blockedLayer = blockedLayer;

        this.health = 100;
        this.maxDamage = 10;

        this.speed = 100;
        this.fireRate = 100;
        this.nextFire = 0;
        this.bulletSpeed = 200;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.onDown.add(this.fire, this);

        this.bullets = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.bullets.createMultiple(10, 'bullet-1');
        this.bullets.forEach(function (bullet) {
            bullet.anchor.setTo(0.5);
            bullet.scale.setTo(0.9);
            bullet.smoothed = false;
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        });

        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.game.add.existing(this);
    }

    _createClass(Player, [{
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

                GLOBAL.manager.broadcast({
                    type: 'shoot',
                    bullet: shootInfo
                });
            }
        }
    }, {
        key: 'addDamage',
        value: function addDamage(data) {
            this.health -= data.damage;
            console.log('addDamage currentHealth: ', this.health);
        }
    }, {
        key: 'update',
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

            this.game.physics.arcade.collide(this.bullets, this.blockedLayer, function (bullet) {
                bullet.kill();
            });

            this.onlineUpdate();
        }
    }, {
        key: 'onlineUpdate',
        value: function onlineUpdate() {
            GLOBAL.manager.broadcast({
                type: 'position',
                posX: parseInt(this.position.x),
                posY: parseInt(this.position.y)
            });
        }
    }]);

    return Player;
})(Phaser.Sprite);

exports['default'] = Player;
module.exports = exports['default'];

},{}]},{},[1])


//# sourceMappingURL=app.js.map
