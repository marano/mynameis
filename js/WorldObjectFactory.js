function WorldObjecFactory() {
}

WorldObjecFactory.prototype.create = function (worldObjectName, tile) {
  newWorldObject = new WorldObject(tile, _.find(this.data, function (worldObjectData) {
    return worldObjectData.name === worldObjectName;
  }));
  tile.addWorldObject(newWorldObject);
  return newWorldObject;
};

WorldObjecFactory.prototype.loadData = function (callback) {
  var self = this;

  $.getJSON('/json/world-objects.json', function (data) {
    self.data = data['world_objects'];
    callback();
  });
};