function WorldTile(world, x, y) {
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = [];
}

WorldTile.prototype.onWorldObjectsUpdated = function (worldObjectsUpdatedCallback) {
  this.worldObjectsUpdated = worldObjectsUpdatedCallback;
};

WorldTile.prototype.setMoveWorldObjectHandler = function (moveWorldObjectHandler) {
  this.moveWorldObjectHandler = moveWorldObjectHandler;
};

WorldTile.prototype.canBePassedThrough = function () {
  return _.all(this.worldObjects, 'allowPassThrough');
};

WorldTile.prototype.moveTo = function (worldObject, targetTile, interval, onMoveCallback) {
  var self = this;
  this.moveWorldObjectHandler(worldObject, targetTile, interval, function (rollbackMove) {
    var success = targetTile.canBePassedThrough();
    if (success) {
      self.worldObjects.remove(worldObject);
      if (self.worldObjectsUpdated) {
        self.worldObjectsUpdated(self.worldObjects);
      }
      targetTile.addWorldObject(worldObject);
      onMoveCallback(true);
    } else {
      rollbackMove(function () {
        onMoveCallback(false);
      });
    }
  });
};

WorldTile.prototype.addWorldObject = function (worldObject) {
  worldObject.tile = this;
  this.worldObjects.push(worldObject);
  if (this.worldObjectsUpdated) {
    this.worldObjectsUpdated(this.worldObjects);
  }
};

WorldTile.prototype.distanceFrom = function (anotherTile) {
  return Math.sqrt(Math.pow(this.x - anotherTile.x, 2) + Math.pow(this.y - anotherTile.y, 2));
};