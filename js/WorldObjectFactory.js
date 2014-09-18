function WorldObjecFactory() {
  this.data = [];
  this.world = undefined;
}

WorldObjecFactory.prototype.createUiElement = function (tile, uiElementName) {
  return new UIElement(uiElementName, tile);
};

WorldObjecFactory.prototype.uiElementData = function (uiElementName) {
  return _.find(this.data.uiElements, function (uiElementData) {
    return uiElementData.name === uiElementName;
  });
};

WorldObjecFactory.prototype.createWorldObject = function (worldObjectName, tile) {
  var newWorldObject = new WorldObject(tile, _.find(this.data.worldObjects, function (worldObjectData) {
    return worldObjectData.name === worldObjectName;
  }));
  tile.addWorldObject(newWorldObject);
  return newWorldObject;
};

WorldObjecFactory.prototype.loadData = function (callback) {
  var self = this;

  $.getJSON('/json/world-objects.json', function (data) {
    self.data = data;
    callback();
  });
};