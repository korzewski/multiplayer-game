import MovableObject from './MovableObject';

const anchorPosition = {x: 0.5, y: 0.2};

export default class Enemy extends MovableObject{
    constructor(game, posX, posY, spriteName){
        super(game, posX, posY, spriteName, anchorPosition);
        this.game.physics.box2d.enable(this);
        this.body.setCircle(20);
        this.body.fixedRotation = true;
        this.body.mass = 2;
        this.body.linearDamping = 5;
        this.body.setCollisionCategory(4);

        this.moveStepDuration = 500;

        this.health = 25;

        this.game.events.onPlayerMoved.add(this.onPlayerMoved, this);

        this.target = null;
        this.targetMoved = false;
    }

    update() {
        this.updateBlockedGrid();
    }

    addDamage(damage) {
        this.health -= damage;

        if(this.health <= 0) {
            this.game.events.onGridBlocked.dispatch(null, this.blockedGrid);
            this.game.events.onExplosion.dispatch(this.body.x, this.body.y, 1.5);
            this.game.events.onPlayerMoved.remove(this.onPlayerMoved, this);
            this.destroy();
        }
    }

    onPlayerMoved(player) {
        if(!this.target) {
            this.target = player;
            this.setDestinationToGo(this.target.blockedGrid);
        } else {
            this.targetMoved = true;
        }
    }

    setDestinationToGo(targetGridPos) {
        this.game.map.findPath(this.blockedGrid.x, this.blockedGrid.y, targetGridPos.x, targetGridPos.y, (path) => {
            if(path && path.length && this.game) {
                this.goTo(path);
            } else {
                this.target = null;
            }
        });
    }

    goTo(path) {
        let startPos = new Phaser.Point(this.body.x, this.body.y);
        let prevPathIndex = -1;
        let nextPos;

        const percentStep = 1 / (path.length - 1);
        const tweenHelper = {progress: 0};
        tweenHelper.onUpdate = (tween, value) => {
            if(!this.game) {
                return
            }

            const pathProgress = value / percentStep,
                pathIndex = Math.floor(pathProgress),
                pathIndexProgress = pathProgress - pathIndex;

            if(pathIndex !== prevPathIndex) {
                if(this.targetMoved) {
                    this.targetMoved = false;
                    this.setDestinationToGo(this.target.blockedGrid);
                }

                prevPathIndex = pathIndex;
                startPos = this.game.map.getGridCenterPosInPx(path[pathIndex].x, path[pathIndex].y);
                nextPos = this.game.map.getGridCenterPosInPx(path[pathIndex + 1].x, path[pathIndex + 1].y);

                if(nextPos.x - startPos.x > 1) {
                    this.scale.x = -1;
                } else if(nextPos.x - startPos.x < -1) {
                    this.scale.x = 1;
                }
            }

            this.body.x = this.getPositionBetweenTwoPoints(startPos.x, nextPos.x, pathIndexProgress);
            this.body.y = this.getPositionBetweenTwoPoints(startPos.y, nextPos.y, pathIndexProgress);
        }

        tweenHelper.onComplete = () => {
            this.target = null;
        };

        this.game.tweens.remove(this.tweenMove);

        this.tweenMove = this.game.add.tween(tweenHelper).to( { progress: 1}, this.moveStepDuration * path.length).start();
        this.tweenMove.onUpdateCallback(tweenHelper.onUpdate);
        this.tweenMove.onComplete.addOnce(tweenHelper.onComplete);
    }

    getPositionBetweenTwoPoints(posA, posB, percent) {
        const offset = (posB - posA) * percent;
        return posA + offset;
    }
}
