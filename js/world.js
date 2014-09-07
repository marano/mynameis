function World(worldObjecFactory) {
  var self = this;

  this.worldObjecFactory = worldObjecFactory;
  self.width = 50;
  self.height = 25;
  self.tickInterval = 500;
  self.tiles = [];

  function initialize() {
    _.times(self.height, function (x) {
      _.times(self.width, function (y) {
        var tile = new WorldTile(self, x, y);
        self.tiles.push(tile);
      });
    });
  }

  initialize();
}

World.prototype.loadObjects = function () {
  var self = this;

  _.each(this.tiles, function (tile) {
    self.worldObjecFactory.create('Grassland', tile);
  });

  this.worldObjecFactory.create('Guy', this.tileAt(9, 9));
  this.worldObjecFactory.create('Guy', this.tileAt(14, 14));
};

World.prototype.worldObjects = function () {
  return _(this.tiles).map(function (tile) { return tile.worldObjects; }).flatten().value();
};

World.prototype.tileAt = function (x, y) {
  return _.find(this.tiles, function (tile) { return tile.x === x && tile.y === y; });
};

World.prototype.startTicking = function () {
  var self = this;

  setTimeout(function () {
    self.tick();
    self.startTicking();
  }, self.tickInterval);
};

World.prototype.tick = function () {
  _.each(this.worldObjects(), function (worldObject) { worldObject.tick(); });
};
