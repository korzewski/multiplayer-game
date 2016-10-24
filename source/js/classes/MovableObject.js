const minMoveDistance = 5;

export default class MovableObject extends Phaser.Sprite{
    constructor(game, posX, posY, spriteName, anchorPosition){
        super(game, posX, posY, spriteName);

        this.anchorPosition = anchorPosition || {x: 0.5, y: 0.5};
        this.anchor.setTo(this.anchorPosition.x, this.anchorPosition.y);
        
        this.lastPosition = new Phaser.Point(this.x, this.y);
        this.mapDetails = this.game.map.getDetails();
        this.blockedGrid = {};
        this.lastBlockedGrid = {};
        this.game.add.existing(this);
    }

    updateBlockedGrid() {
    	const isPlayerMoved = (Math.abs(this.lastPosition.x - this.position.x) > minMoveDistance || Math.abs(this.lastPosition.y - this.position.y) >  minMoveDistance)
    	
    	if(isPlayerMoved) {
	    	this.lastPosition = new Phaser.Point(this.x, this.y);
	        const gridX = Math.round(this.position.x / this.mapDetails.gridSize - this.anchorPosition.x),
	        gridY = Math.round(this.position.y / this.mapDetails.gridSize - this.anchorPosition.y);

	        this.blockedGrid = {x: gridX, y: gridY};

	        if((this.blockedGrid.x !== this.lastBlockedGrid.x) || (this.blockedGrid.y !== this.lastBlockedGrid.y)) {
	            this.game.events.onGridBlocked.dispatch(this.blockedGrid, this.lastBlockedGrid);
	            this.lastBlockedGrid = this.blockedGrid;
	        }
        }
    }

}