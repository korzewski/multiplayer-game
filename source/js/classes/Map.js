import EasyStar from 'easystarjs';

let pathfinder = new EasyStar.js(),
    grid = [],
    gridReady = false;

const cellSize = 100,
    gridDensity = 2,
    gridSize = cellSize / gridDensity;

export default class Map extends Phaser.Sprite{
    constructor(game, mapName){
        super(game, 0, 0);
        this.game.stage.backgroundColor = '#8f9e85';
        this.map = this.game.add.tilemap(mapName);
        this.map.addTilesetImage('ortho-assets', 'ortho-assets');

        const layerBg = this.map.createLayer('bg');
        const layerBlocked = this.map.createLayer('blocked');
        const layerDestroyable = this.map.createLayer('destroyable');

        this.visualGrid = this.game.add.group();
        this.visualPath = this.game.add.group();
        layerBg.resizeWorld();

        this.initGrid();

        this.blockedObjects = [];
        this.getTilesFromLayer(layerBlocked, this.createBlockedTileObject);
        this.getTilesFromLayer(layerDestroyable, this.createBlockedDestroyableTileObject);

        initPathFinder.call(this);

        this.game.events.onGridTileDestroy = new Phaser.Signal();
        this.game.events.onGridBlocked = new Phaser.Signal();
        this.game.events.onGridTileDestroy.add(onGridTileDestroy, this);
        this.game.events.onGridBlocked.add(onGridBlocked, this);
    }

    getDetails() {
        return { gridSize, cellSize };
    }

    initGrid() {
        for(let i = 0; i < this.map.height * gridDensity; i++) {
            grid.push([]);
            for(let j = 0; j < this.map.width * gridDensity; j++) {
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
        const tilePos = {x: tile.x, y: tile.y};
        const object = new Phaser.Physics.Box2D.Body(this.game, null, tilePos.x * cellSize + cellSize/2, tilePos.y * cellSize + cellSize/2);
        object.static = true;
        object.setRectangle(cellSize, cellSize, 0, 0, 0);
        object.tilePos = tilePos;

        if(destroyable) {
            object.setCollisionCategory(3);
        } else {
            object.setCollisionCategory(2);
        }

        this.blockedObjects.push(object);
        setTile(tilePos, 1);
    }

    createBlockedDestroyableTileObject(tile) {
        this.createBlockedTileObject(tile, true);
    }

    getGridPosInPx(x, y) {
        return {x: x * gridSize, y: y * gridSize};
    }

    getGridCenterPosInPx(x, y) {
        return {x: x * gridSize + gridSize/2, y: y * gridSize + gridSize/2};
    }
}

function onGridBlocked(blockedGridPos, unBlockedGridPos) {
    setGrid.call(this, unBlockedGridPos, 0);
    setGrid.call(this, blockedGridPos, 1);
}

function onGridTileDestroy(pos) {
    setTile.call(this, pos, 0);
}

function initPathFinder() {
    pathfinder.setGrid(grid);
    pathfinder.setAcceptableTiles([0]);

    gridReady = true;
    drawGrid.call(this);
}

function drawPath(path) {
    if(path) {
        this.visualPath.destroy(true, true);

        path.map((tile) => {
            const rect = drawRect.call(this, tile.x, tile.y, 0xff3333);
            this.visualPath.add(rect);
        });
    }
}

function drawRect(x, y, color) {
    const pos = this.getGridPosInPx(x, y);
    const rect = this.game.add.graphics(pos.x, pos.y);
    rect.beginFill(color || 0x333333);
    rect.lineStyle(1, 0x000000);
    rect.drawRect(0, 0, gridSize, gridSize);
    rect.alpha = 0.2;

    return rect;
}

function drawGrid() {
    this.visualGrid.destroy(true, true);

    for(let i = 0; i < this.map.height * gridDensity; i++) {
        for(let j = 0; j < this.map.width * gridDensity; j++) {
            if(grid[i][j] === 1) {
                const rect = drawRect.call(this, j, i);
                this.visualGrid.add(rect);
            }
        }
    }
}

function setTile(tilePos, value) {
    const gridPos = {x: tilePos.x * gridDensity, y: tilePos.y * gridDensity};
    for(let i = 0; i < gridDensity; i++) {
        for(let j = 0; j < gridDensity; j++) {
            setGrid.call(this, {x: gridPos.x + j, y: gridPos.y + i}, value);
        }
    }

    if(value === 0) {
        this.map.removeTile(tilePos.x, tilePos.y, 'destroyable');
    }
}

function setGrid(gridPos, value) {
    if(!gridPos || !gridPos.x) {
        return
    }

    grid[gridPos.y][gridPos.x] = value;

    if(gridReady) {
        drawGrid.call(this);
    }
}
