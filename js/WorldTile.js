function WorldTile(world, x, y) {
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = [];
}

WorldTile.prototype.onUiElementsUpdated = function (uiElementsUpdatedCallback) {
  this.uiElementsUpdated = function (uiElements) { uiElementsUpdatedCallback(uiElements); };
};

WorldTile.prototype.moveTo = function (worldObject, targetTile) {
  this.worldObjects.remove(worldObject);
  if (this.uiElementsUpdated) {
    this.uiElementsUpdated(this.uiElements());
  }
  targetTile.addWorldObject(worldObject);
};

WorldTile.prototype.uiElements = function () {
  return _(this.worldObjects).map(function (worldObject) { return worldObject.uiElements(); }).flatten().value();
};

WorldTile.prototype.addWorldObject = function (worldObject) {
  worldObject.tile = this;
  this.worldObjects.push(worldObject);
  if (this.uiElementsUpdated) {
    this.uiElementsUpdated(this.uiElements());
  }
};

WorldTile.prototype.distanceFrom = function (anotherTile) {
  return Math.sqrt(Math.pow(this.x - anotherTile.x, 2) + Math.pow(this.y - anotherTile.y, 2));
};