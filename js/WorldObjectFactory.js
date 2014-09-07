function WorldObjecFactory() {
}

WorldObjecFactory.prototype.create = function (worldObjectName, tile) {
  newWorldObject = new WorldObject(_.find(this.data, function (worldObjectData) {
    return worldObjectData.name === worldObjectName;
  }));
  tile.addWorldObject(newWorldObject);
  return newWorldObject;
};

WorldObjecFactory.prototype.loadData = function (callback) {
  var self = this;

  $.getJSON('/json/world-objects.json', function (data) {
    self.data = _.map(data['world_objects'], function (worldObjectData) {
      worldObjectData.uiElements = _.map(worldObjectData.uiElements, function (uiElementData) { return new UIElement(uiElementData); });
      return worldObjectData;
    });
    callback();
  });
};