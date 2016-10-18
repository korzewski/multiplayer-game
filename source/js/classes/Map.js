import EasyStar from 'easystarjs';

const mapScale = 0.5;
const cellSize = 200 * mapScale;

let pathfinder = new EasyStar.js(),
    grid = [],
    gridReady = false;

export default class Map extends Phaser.Sprite{
    constructor(game, mapName){
        super(game, 0, 0);

        this.map = this.game.add.tilemap(mapName);
        this.map.addTilesetImage('ortho-assets', 'ortho-assets');

        const layerBg = this.map.createLayer('bg'),
        layerBlocked = this.map.createLayer('blocked'),
        layerDestroyable = this.map.createLayer('destroyable');

        this.visualGrid = this.game.add.group();
        this.visualPath = this.game.add.group();
        layerBg.resizeWorld();

        scaleLayers.call(this, [layerBg, layerBlocked, layerDestroyable]);

        this.initGrid();

        this.blockedObjects = [];
        this.getTilesFromLayer(layerBlocked, this.createBlockedTileObject);
        this.getTilesFromLayer(layerDestroyable, this.createBlockedDestroyableTileObject);

        initPathFinder.call(this);

        this.game.events.onGridTileDestroy = new Phaser.Signal();
        this.game.events.onGridTileDestroy.add(onGridTileDestroy, this);
    }

    initGrid() {
        for(let i = 0; i < this.map.height; i++) {
            grid.push([]);
            for(let j = 0; j < this.map.width; j++) {
                grid[i][j] = 0;
            }
        }
    }

    findPath(startX, startY, endX, endY, callback) {
        pathfinder.findPath(startX, startY, endX, endY, (path) => {
            if(callback) {
                callback.call(this, path);
            }
            drawPath.call(this, path);
        });
        pathfinder.calculate();
    }

    getTilesFromLayer(layer, callback) {
        const blockedTiles = layer.getTiles(0, 0, this.game.world.width, this.game.world.height);
        blockedTiles.map((tile) => {
            if(tile.index !== -1) {
                callback.call(this, tile);
            }
        });
    }

    createBlockedTileObject(tile, destroyable) {
        const object = new Phaser.Physics.Box2D.Body(this.game, null, tile.x * cellSize + cellSize/2, tile.y * cellSize + cellSize/2);
        object.static = true;
        object.setRectangle(cellSize, cellSize, 0, 0, 0);
        object.gridPos = {x: tile.x, y: tile.y};

        if(destroyable) {
            object.setCollisionCategory(3);
        } else {
            object.setCollisionCategory(2);
        }

        this.blockedObjects.push(object);
        setGridTile({x: tile.x, y: tile.y}, 1);
    }

    createBlockedDestroyableTileObject(tile) {
        this.createBlockedTileObject(tile, true);
    }
}

function onGridTileDestroy(pos) {
    setGridTile.call(this, pos, 0);
}

function initPathFinder() {
    pathfinder.setGrid(grid);
    pathfinder.setAcceptableTiles([0]);

    gridReady = true;
    drawGrid.call(this);
}

function drawPath(path) {
    this.visualPath.destroy(true, true);

    path.map((tile) => {
        const rect = drawRect.call(this, tile.x, tile.y, 0xff3333);
        this.visualPath.add(rect);
    });
}

function drawRect(x, y, color) {
    const pos = getTilePosInPx(x, y);
    const rect = this.game.add.graphics(pos.x, pos.y);
    rect.beginFill(color || 0x333333);
    rect.drawRect(0, 0, cellSize, cellSize);
    rect.alpha = 0.2;

    return rect;
}

function drawGrid() {
    this.visualGrid.destroy(true, true);

    for(let i = 0; i < this.map.height; i++) {
        for(let j = 0; j < this.map.width; j++) {
            if(grid[i][j] === 1) {
                const rect = drawRect.call(this, j, i);
                this.visualGrid.add(rect);
            }
        }
    }
}

function getTilePosInPx(x, y) {
    return {x: x * cellSize, y: y * cellSize};
}

function setGridTile(pos, value) {
    grid[pos.y][pos.x] = value;

    if(value === 0) {
        this.map.removeTile(pos.x, pos.y, 'destroyable');
    }

    if(gridReady) {
        drawGrid.call(this);
        this.findPath(0, 0, 5, 0);
    }
}

function scaleLayers(layers) {
    layers.forEach((layer) => {
        layer.scale.setTo(mapScale);
        layer.resize(this.game.width / mapScale, this.game.height / mapScale);
    });
}