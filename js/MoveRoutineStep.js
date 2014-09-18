function MoveRoutineStep(worldObject, targetTile, cost) {
  this.worldObject = worldObject;
  this.targetTile = targetTile;
  this.cost = cost;
}

MoveRoutineStep.prototype.perform = function () {
  if (this.targetTile.canBePassedThrough()) {
    var interval = this.cost * this.worldObject.world.tickInterval;
    this.worldObject.moveTo(this.targetTile, interval);
  }
};