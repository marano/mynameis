function WorldObject(data) {
  this.data = data;
  this.name = data.name;
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.uiElements = function () {
  return this.data.uiElements;
};