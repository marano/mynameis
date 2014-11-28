function World(worldObjecFactory) {
  var self = this;

  worldObjecFactory.world = this;

  this.log = {
    tickDuration: false
  };
  this.worldObjectFactory = worldObjecFactory;
  this.width = 50;
  this.height = 30;
  this.tickInterval = 100;
  this.tiles = ko.observableArray([]);
  self.selectedTile = ko.observable();
  self.selectedWorldObject = ko.observable();
  this.paused = false;

  this.tileSize = 24;

  this.widthInPixels = this.width * this.tileSize;
  this.heightInPixels = this.height * this.tileSize;

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
    self.worldObjectFactory.createWorldObject('Grassland', tile);
  });

  this.worldObjectFactory.createWorldObject('Human', this.tileAt(5, 5));
  this.worldObjectFactory.createWorldObject('Human', this.tileAt(5, 6));
  this.worldObjectFactory.createWorldObject('Human', this.tileAt(5, 7));
  this.worldObjectFactory.createWorldObject('Human', this.tileAt(5, 8));
  this.worldObjectFactory.createWorldObject('Human', this.tileAt(9, 9));
  this.worldObjectFactory.createWorldObject('Human', this.tileAt(14, 14));
  this.worldObjectFactory.createWorldObject('Tree', this.tileAt(9, 11));
  this.worldObjectFactory.createWorldObject('Red Mushroom', this.tileAt(15, 11));
};

World.prototype.tileAt = function (x, y) {
  return _.find(this.tiles(), function (tile) { return tile.x === x && tile.y === y; });
};

World.prototype.startTicking = function () {
  this.tickAfter(this.tickInterval);
};

World.prototype.tickAndEnqueuTick = function () {
  var tickStart = new Date();
  this.tick();
  var tickEnd = new Date();
  var tickDuration = (tickEnd - tickStart);
  var nextTickWait = this.tickInterval - tickDuration;
  if (nextTickWait < 0) {
    nextTickWait = 0;
  }
  if (this.log.tickDuration) {
    console.log('tick duration: ' + tickDuration + 'ms, next tick wait: ' + nextTickWait + 'ms');
  }
  this.tickAfter(nextTickWait);
}

World.prototype.tickAfter = function (wait) {
  var self = this;

  setTimeout(function () {
    self.tickAndEnqueuTick();
  }, wait);
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
