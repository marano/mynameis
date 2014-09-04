function WorldTile(world, x, y) {
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = [];
}

WorldTile.prototype.uiElements = function () {
  return _(this.worldObjects).map(function (worldObject) {
    return worldObject.uiElements();
  }).flatten().value();
};


WorldTile.prototype.addWorldObject = function (worldObject) {
  this.worldObjects.push(worldObject);
};