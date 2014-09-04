function WorldObject() {
}

WorldObject.prototype.tick = function () {};

WorldObject.prototype.uiElements = function () {
  return ['grass-land'];
};

function WorldTile(x, y) {
  var self = this;

  self.x = x;
  self.y = y;
  self.worldObjects = [];
}

WorldTile.prototype.uiElements = function () {
  return _(this.worldObjects).map(function (worldObject) {
    return worldObject.uiElements();
  }).flatten().value();
};


WorldTile.prototype.addWorldObject = function (worldObject) {
  this.worldObjects.push(worldObject);
};

function World() {
  var self = this;

  self.size = 20;
  self.tickInterval = 1000;
  self.worldTiles = [];

  function initialize() {
    _.times(self.size, function (x) {
      _.times(self.size, function (y) {
        self.worldTiles.push(new WorldTile(x, y));
      });
    });

    self.tileAt(9, 9).addWorldObject(new WorldObject());
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
