function World(worldObjecFactory) {
  var self = this;

  this.worldObjecFactory = worldObjecFactory;
  self.width = 50;
  self.height = 25;
  self.tickInterval = 500;
  self.worldTiles = [];

  function initialize() {
    _.times(self.height, function (x) {
      _.times(self.width, function (y) {
        var tile = new WorldTile(self, x, y);
        self.worldTiles.push(tile);
        self.worldObjecFactory.create('Grassland', tile)
      });
    });

    worldObjecFactory.create('Guy', self.tileAt(9, 9));
    worldObjecFactory.create('Guy', self.tileAt(14, 14));
  }

  initialize();
}

World.prototype.worldObjects = function () {
  return _(this.worldTiles).map(function (tile) { return tile.worldObjects; }).flatten().value();
};

World.prototype.tileAt = function (x, y) {
  return _.find(this.worldTiles, function (tile) { return tile.x === x && tile.y === y; });
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

World.prototype.afterTick = function (callback) { this.afterTickCallback = callback; };
