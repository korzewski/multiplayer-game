const mapScale = 0.5;
const cellSize = 200 * mapScale;

export default class Map extends Phaser.Sprite{
    constructor(game, mapName){
        super(game, 0, 0);

        this.map = this.game.add.tilemap(mapName);
        this.map.addTilesetImage('ortho-assets', 'ortho-assets');
        const layerBg = this.map.createLayer('bg'),
        layerBlocked = this.map.createLayer('blocked');

        layerBg.resizeWorld();

        this.scaleLayer(layerBg);
        this.scaleLayer(layerBlocked);

        this.blockedObjects = [];
        const blockedTiles = layerBlocked.getTiles(0, 0, this.game.world.width, this.game.world.height);
        blockedTiles.map(this.initBlockedObjects, this);

        // this.layerBg.scale.setTo(0.2);
        // this.map.setTileSize(50, 50);
        // this.layerBlocked.scale.setTo(0.2);
        // this.layerBlocked.setTileSize(50, 50);


        // this.map.setCollisionBetween(1, 10000, true, 'blocked');

        // this.coins = this.game.add.group();
        // this.coins.enableBody = true;
        // this.map.createFromObjects('money', 'mm', 'coin', 0, true, false, this.coins);

        // this.obstacles = this.game.add.group();
        // this.obstacles.enableBody = true;
        // this.map.createFromObjects('obstacles', '', 'bullet-2', 0, true, false, this.obstacles, Obstacle);
    }

    scaleLayer(layer) {
        layer.scale.setTo(mapScale);
        layer.resize(this.game.width / mapScale, this.game.height / mapScale);
    }

    initBlockedObjects(tile) {
        if(tile.index !== -1) {
            this.createBlockedTileObject(tile);
        }
    }

    createBlockedTileObject(tile) {
        const object = new Phaser.Physics.Box2D.Body(this.game, null, tile.x * cellSize + cellSize/2, tile.y * cellSize + cellSize/2);
        object.static = true;
        object.setRectangle(cellSize, cellSize, 0, 0, 0);
        object.setCollisionCategory(2);

        this.blockedObjects.push(object);
    }
}