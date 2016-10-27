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

        this.moveStepDuration = 400;

        this.health = 25;

        this.game.events.onPlayerMoved.add(this.onPlayerMoved, this);
        this.game.events.onPlayerDie.add(this.onPlayerDie, this);
        this.game.events.onGridTileDestroy.add(this.onGridTileDestroy, this);
        this.game.events.onGridBlocked.add(this.onGridBlocked, this);

        this.path = [];
        this.target = null;
        this.findNewPath = false;

        this.isAttacking = false;
        this.maxPower = 10;
        this.distanceToAttack = 2;
        this.attackRate = 500;
        this.nextAttack = 0;

        this.setTarget();
    }

    update() {
        this.updateBlockedGrid();

        if(this.isAttacking) {
            this.attack();
        }
    }

    updatePath(path) {
        this.path = path;

        if(this.target) {
            this.isAttacking = true;
        }
    }

    attack() {
        if(!this.target) {
            this.isAttacking = false;
            return
        }

        if(this.path.length <= this.distanceToAttack && this.game.time.now > this.nextAttack) {
            this.nextAttack = this.game.time.now + this.attackRate;

            const damage = this.game.rnd.integerInRange(this.maxPower/2, this.maxPower);
            this.target.addDamage(damage);
        }
    }

    onPlayerDie(player) {
        this.stopFollowPlayer();
    }

    setTarget() {
        const targetIndex = this.game.rnd.integerInRange(0, this.game.map.targets.length - 1);
        this.destination = this.game.map.targets[targetIndex];

        this.setDestinationToGo(this.destination);
    }

    addDamage(damage) {
        this.health -= damage;

        if(this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.game.events.onGridBlocked.remove(this.onGridBlocked, this);
        this.game.events.onPlayerMoved.remove(this.onPlayerMoved, this);

        this.game.events.onGridBlocked.dispatch(null, this.blockedGrid);
        this.game.events.onExplosion.dispatch(this.body.x, this.body.y, 1.5);
        this.destroy();
    }

    onGridBlocked(blocked, unblocked) {
        const blockedStringify = JSON.stringify(blocked);
        if(JSON.stringify(this.blockedGrid) !== blockedStringify) {
            for(let i = 0; i < this.path.length; i++) {
                if(JSON.stringify(this.path[i]) === blockedStringify) {
                    this.findNewPath = true;
                    break;
                }
            }
        }
    }

    onGridTileDestroy() {
        this.findNewPath = true;
    }

    onPlayerMoved(player) {
        if(!this.tweenMove.isRunning) {
            if(this.target) {
                this.setDestinationToGo(this.target.blockedGrid);
            }
        }
    }

    checkDistanceToPlayer(player) {
        this.setDestinationToGo(player.blockedGrid, (path) => {
            if(path && path.length) {
                if(!this.target) {
                    if(path.length < 8) {
                        this.startFollowPlayer(player);
                    } 
                } else {
                    if(path.length > 12) {
                        this.stopFollowPlayer();
                        return;
                    }

                    this.findNewPath = true;
                }
            }
        });
    }

    startFollowPlayer(player) {
        this.target = player;
        this.setDestinationToGo(this.target.blockedGrid);
    }

    stopFollowPlayer() {
        this.target = null;
        this.setDestinationToGo(this.destination);
    }

    setDestinationToGo(targetGridPos, callback) {
        if(this.game) {
            this.game.map.findPath(this.blockedGrid.x, this.blockedGrid.y, targetGridPos.x, targetGridPos.y, (path) => {
                if(callback) {
                    callback(path);
                    return
                }

                if(path && path.length && this.game) {
                    this.goTo(path);
                }
            });
        }
    }

    goTo(path) {
        this.updatePath(path);

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
                tweenHelper.onNextGrid(pathIndex);
            }

            this.body.x = this.getPositionBetweenTwoPoints(startPos.x, nextPos.x, pathIndexProgress);
            this.body.y = this.getPositionBetweenTwoPoints(startPos.y, nextPos.y, pathIndexProgress);
        }

        tweenHelper.onNextGrid = (pathIndex) => {
            if(this.findNewPath) {
                this.findNewPath = false;

                if(this.target) {
                    this.setDestinationToGo(this.target.blockedGrid);
                } else {
                    this.setDestinationToGo(this.destination);
                }
            } else {
                this.checkDistanceToPlayer(this.game.player);
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

        tweenHelper.onComplete = () => {
            if(JSON.stringify(this.blockedGrid) === JSON.stringify(this.destination)) {
                this.game.events.onEnemyReachDestination.dispatch(this.blockedGrid);
                this.die();
            }

            this.updatePath([]);
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
