function WorldObject(data) {
  this.data = data;
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.uiElements = function () {
  return this.data.uiElements;
};