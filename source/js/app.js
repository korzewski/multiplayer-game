import Level1 from './classes/Level1'
import Manager from './classes/Manager';

class Init extends Phaser.Game {
    constructor() {
        super(GLOBAL.width, GLOBAL.height, Phaser.AUTO, 'game');
        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('Level1', Level1, false);
        this.state.start('Boot');
    }
}

class Boot extends Phaser.State {
    create() {
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
}

class Preloader extends Phaser.State{
    preload() {
        this.game.load.tilemap('level1', 'extra/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('level1-tiles', 'extra/maps/level1-tiles.png');
        this.game.load.image('player', 'extra/img/player.png');
        this.game.load.image('coin', 'extra/img/coin.png');
        this.game.load.image('bullet-1', 'extra/img/bullet-1.png');
        this.game.load.image('bullet-2', 'extra/img/bullet-2.png');
        this.game.load.spritesheet('explosion', 'extra/img/explosion.png', 64, 64);
    }

    create(){
        GLOBAL.game = this.game;
        GLOBAL.manager = new Manager();
        this.game.state.start('Level1');
    }

}

new Init();