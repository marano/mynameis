function WorldObjecFactory() {
  var self = this;
  this.data = [];
  this.world = undefined;
}

WorldObjecFactory.prototype.createUiElmentOnTile = function (tile, uiElementName) {
  var uiElement = new UIElement(tile, this.world, this.uiElementData(uiElementName));
  this.world.uiElements.push(uiElement);
  return uiElement;
};

WorldObjecFactory.prototype.createUiElmentOnWorldObject = function (worldObject, uiElementName) {
  var uiElement = new UIElement(worldObject.tile(), this.world, this.uiElementData(uiElementName));
  this.world.uiElements.push(uiElement);
  return uiElement;
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