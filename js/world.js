function World(worldObjecFactory) {
  var self = this;

  worldObjecFactory.world = this;

  this.log = {
    tickDuration: false
  };
  this.worldObjecFactory = worldObjecFactory;
  this.width = 50;
  this.height = 30;
  this.tickInterval = 100;
  this.tiles = ko.observableArray([]);
  self.selectedTile = ko.observable();
  self.selectedWorldObject = ko.observable();
  this.paused = false;

  this.widthInPixels = this.width * 30;
  this.heightInPixels = this.height * 30;

  this.canvasStyle = 'width: ' + this.widthInPixels + 'px; height: ' + this.heightInPixels + 'px;';

  this.worldObjects = ko.computed(function () {
    return _(self.tiles()).map(function (tile) { return tile.worldObjects(); }).flatten().value();
  });

  this.uiElements = ko.observableArray([]);

  this.activeAction = ko.computed(function () {
    return _(self.worldObjects()).map(function (worldObject) {
      return worldObject.actions;
    }).flatten().find(function (action) {
      return action.active();
    });
  });

  function initialize() {
    _.times(self.height, function (y) {
      _.times(self.width, function (x) {
        self.tiles.push(new WorldTile(self, x, y));
      });
    });
  }

  initialize();
}

World.prototype.loadObjects = function () {
  var self = this;

  _.each(this.tiles(), function (tile) {
    self.worldObjecFactory.createWorldObject('Grassland', tile);
  });

  this.worldObjecFactory.createWorldObject('Guy', this.tileAt(9, 9));
  this.worldObjecFactory.createWorldObject('Guy', this.tileAt(14, 14));
};

World.prototype.tileAt = function (x, y) {
  return _.find(this.tiles(), function (tile) { return tile.x === x && tile.y === y; });
};

World.prototype.startTicking = function () {
  var self = this;

  var nextTickInterval = this.tickInterval;

  setTimeout(function () {
    if (self.log.tickDuration) {
      var tickStart = new Date();
    }
    self.tick();
    var tickEnd = new Date();
    var tickDuration = (tickEnd - tickStart);
    nextTickInterval = self.tickInterval - tickDuration;
    if (nextTickInterval < 0) {
      nextTickInterval = 0;
    }
    if (self.log.tickDuration) {
      console.log('tick duration: ' + tickDuration + 'ms, next tick interval: ' + nextTickInterval + 'ms');
    }
    self.startTicking();
  }, nextTickInterval);
};

World.prototype.tick = function () {
  if (!this.paused) {
    _.each(this.worldObjects(), function (worldObject) { worldObject.tick(); });
  }
};

World.prototype.pause = function () {
  this.paused = true;
};

World.prototype.unpause = function () {
  this.paused = false;
};