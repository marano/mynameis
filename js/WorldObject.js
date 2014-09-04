function WorldObject(worldTile) {
  this.worldTile = worldTile;
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.uiElements = function () {
  return ['grass-land'];
};