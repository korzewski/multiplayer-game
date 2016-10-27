import Manager from './classes/Manager';
import ReactUI from './reactUI';
import Game from './classes/Game';

const defaultValues = {
    width: 1100,
    height: 600
};

class Init extends Phaser.Game {
    constructor() {
        super(defaultValues.width, defaultValues.height, Phaser.AUTO, 'game');
        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('Game', Game, false);
        this.state.start('Boot');
    }
}

class Boot extends Phaser.State {
    create() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        // if (this.game.device.desktop) {
        //     this.scale.pageAlignHorizontally = true;
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.maxWidth = 700;
            // this.scale.maxHeight = 700;
        // } else {
        //     // mobile settings
        //     this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //     this.scale.minWidth = 480;
        //     this.scale.minHeight = 260;
        //     this.scale.maxWidth = 1024;
        //     this.scale.maxHeight = 768;
        //     this.scale.forceLandscape = true;
        //     this.scale.pageAlignHorizontally = true;
        //     this.scale.refresh();
        // }

        this.game.state.start('Preloader', true, false);
    }
}

class Preloader extends Phaser.State{
    preload() {
        this.game.load.tilemap('map-1', 'extra/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ortho-assets', 'extra/img/ortho-assets.png');
        this.game.load.spritesheet('dustBuster', 'extra/img/dustbuster.png', 85, 100);
        this.game.load.image('dustBuster2', 'extra/img/dustbuster2.png');
        this.game.load.image('dustBuster3', 'extra/img/dustbuster3.png');
        this.game.load.image('bullet-1', 'extra/img/bullet-1.png');
        this.game.load.image('bullet-2', 'extra/img/bullet-2.png');
        this.game.load.image('aim', 'extra/img/aim.png');
        this.game.load.spritesheet('explosion', 'extra/img/explosion.png', 64, 64);
    }

    create(){
        this.game.manager = new Manager(this);
    }

}

new Init();
