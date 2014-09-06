function WorldObject(tile, data) {
  this.data = data;
  this.name = data.name;
  this.tile = tile;
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.uiElements = function () {
  return this.data.uiElements;
};