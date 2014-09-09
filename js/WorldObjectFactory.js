function WorldObjecFactory() {
  this.data = [];
}

WorldObjecFactory.prototype.create = function (worldObjectName, tile) {
  newWorldObject = new WorldObject(tile.world, _.find(this.data, function (worldObjectData) {
    return worldObjectData.name === worldObjectName;
  }));
  tile.addWorldObject(newWorldObject);
  return newWorldObject;
};

WorldObjecFactory.prototype.loadData = function (callback) {
  var self = this;

  $.getJSON('/json/world-objects.json', function (data) {
    self.data = _.map(data['world_objects'], function (worldObjectData) {
      return worldObjectData;
    });
    callback();
  });
};