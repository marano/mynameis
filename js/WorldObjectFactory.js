function WorldObjecFactory() {
  this.data = [];
}

WorldObjecFactory.prototype.createUiElmentOnTile = function (tile, uiElementName) {
  var tileProvider = function () { return tile; };
  return new UIElement(tileProvider, this.uiElementData(uiElementName));
};

WorldObjecFactory.prototype.createUiElmentOnWorldObject = function (worldObject, uiElementName) {
  return new UIElement(worldObject.tile, this.uiElementData(uiElementName));
};

WorldObjecFactory.prototype.uiElementData = function (uiElementName) {
  return _.find(this.data.uiElements, function (uiElementData) {
    return uiElementData.name === uiElementName;
  });
};

WorldObjecFactory.prototype.createWorldObject = function (worldObjectName, tile) {
  var newWorldObject = new WorldObject(tile.world, _.find(this.data.worldObjects, function (worldObjectData) {
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