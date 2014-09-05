function World(worldObjecFactory) {
  var self = this;

  this.worldObjecFactory = worldObjecFactory;
  self.size = 30;
  self.tickInterval = 500;
  self.worldTiles = [];

  function initialize() {
    _.times(self.size, function (x) {
      _.times(self.size, function (y) {
        var tile = new WorldTile(self, x, y);
        self.worldTiles.push(tile);
        self.tileAt(x, y).addWorldObject(self.worldObjecFactory.create('Grassland'));
      });
    });

    var tile = self.tileAt(9, 9);
    tile.addWorldObject(worldObjecFactory.create('Guy'));
  }

  initialize();
}

World.prototype.worldObjects = function () {
  return _(this.worldTiles).map(function (tile) {
    return tile.worldObjects;
  }).flatten().value();
};

World.prototype.tileAt = function (x, y) {
  return _.find(this.worldTiles, function (tile) {
    return tile.x === x && tile.y === y;
  });
};

World.prototype.startTicking = function () {
  var self = this;

  setTimeout(function () {
    self.tick();
    self.afterTickCallback();
    self.startTicking();
  }, self.tickInterval);
};

World.prototype.tick = function () {
  _.each(this.worldObjects(), function (worldObject) { worldObject.tick(); });
};

World.prototype.afterTick = function (callback) {
  this.afterTickCallback = callback;
};
