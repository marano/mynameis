function World(worldObjecFactory) {
  var self = this;

  worldObjecFactory.world = this;

  this.log = {
    tickDuration: false
  };
  this.worldObjectFactory = worldObjecFactory;
  this.width = 70;
  this.height = 40;
  this.tickInterval = 100;
  this.viewportX = ko.observable(0);
  this.viewportY = ko.observable(0);
  this.viewportSizeX = ko.observable(0);
  this.viewportSizeY = ko.observable(0);
  this.tiles = ko.observableArray([]);
  this.viewportUiElements = ko.observableArray([]);

  this.paused = false;

  this.tileSize = 24;

  this.worldObjects = ko.computed(function () {
    return _(self.tiles()).map(function (tile) { return tile.worldObjects(); }).flatten().value();
  });

  this.selectedWorldObject = ko.computed(function () {
    return _.find(self.worldObjects(), function (worldObject) { return worldObject.selected(); });
  });

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

    self.updateViewportSize();
    $(window).on('resize', function () { self.updateViewportSize(); })
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
};

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

World.prototype.uiElementCreated = function (uiElement) {
  if (uiElement.tile().visibleInViewport()) {
    this.viewportUiElements.push(uiElement);
  }
};

World.prototype.uiElementRemoved = function (uiElement) {
  if (uiElement.tile().visibleInViewport()) {
    this.viewportUiElements.remove(uiElement);
  }
};

World.prototype.worldObjectMovedToTile = function (worldObject, targetTile, fromTile) {
  var self = this;

  if (targetTile.visibleInViewport() && (!fromTile || !fromTile.visibleInViewport())) {
    _.each(worldObject.uiElements(), function (uiElement) {
      self.viewportUiElements.push(uiElement);
    });
  } else if ((fromTile && fromTile.visibleInViewport()) && !targetTile.visibleInViewport()) {
    _.each(worldObject.uiElements(), function (uiElement) {
      self.viewportUiElements.remove(uiElement);
    });
  }
};

World.prototype.updateViewportSize = function () {
  var $canvas = $(window);
  this.viewportSizeX(Math.ceil($canvas.width() / this.tileSize));
  this.viewportSizeY(Math.ceil($canvas.height() / this.tileSize));
  this.updateViewportUiElements();
};

World.prototype.updateViewportUiElements = function (uiElement) {
  var uiElements = _(this.tiles()).map(function (tile) {
    if (tile.visibleInViewport()) {
      return tile.uiElements();
    } else {
      return [];
    }
  }).flatten().value();
  this.viewportUiElements(uiElements);
};
