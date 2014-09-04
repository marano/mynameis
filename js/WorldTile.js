function WorldTile(world, x, y) {
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = [];
  this.hovered = false;
  this.selected = false;
}

WorldTile.prototype.setSelected = function () {
  this.selected = true;
};

WorldTile.prototype.setUnselected = function () {
  this.selected = false;
};

WorldTile.prototype.setHovered = function () {
  this.hovered = true;
};

WorldTile.prototype.unsetHovered = function () {
  this.hovered = false;
};

WorldTile.prototype.uiElements = function () {
  return _(this.worldObjects).map(function (worldObject) {
    return worldObject.uiElements();
  }).flatten().value();
};


WorldTile.prototype.addWorldObject = function (worldObject) {
  this.worldObjects.push(worldObject);
};