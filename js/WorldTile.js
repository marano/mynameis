function WorldTile(world, x, y) {
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = [];
}

WorldTile.prototype.onWorldObjectsUpdated = function (worldObjectsUpdatedCallback) {
  this.worldObjectsUpdated = function (worldObjects) { worldObjectsUpdatedCallback(worldObjects); };
};

WorldTile.prototype.canBePassedThrough = function () {
  return _.all(this.worldObjects, 'allowPassThrough');
};

WorldTile.prototype.moveTo = function (worldObject, targetTile) {
  this.worldObjects.remove(worldObject);
  if (this.worldObjectsUpdated) {
    this.worldObjectsUpdated(this.worldObjects);
  }
  targetTile.addWorldObject(worldObject);
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