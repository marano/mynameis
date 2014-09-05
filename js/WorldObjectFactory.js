function WorldObjecFactory() {
}

WorldObjecFactory.prototype.create = function (worldObjectName) {
  return new WorldObject(_.find(this.data, function (worldObjectData) {
    return worldObjectData.name === worldObjectName;
  }));
};

WorldObjecFactory.prototype.loadData = function (callback) {
  var self = this;

  $.getJSON('/json/world-objects.json', function (data) {
    self.data = data['world_objects'];
    callback();
  });
};