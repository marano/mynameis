function World(worldObjecFactory) {
  var self = this;

  worldObjecFactory.world = this;

  this.log = {
    tickDuration: false
  };

  this.worldObjectFactory = worldObjecFactory;

  this.tileSize = 24;
  this.width = 70;
  this.height = 50;
  this.widthInPixels = this.width * this.tileSize;
  this.heightInPixels = this.height * this.tileSize;

  this.tickInterval = 100;
  this.paused = false;

  this.viewportX = ko.observable(0);
  this.viewportY = ko.observable(0);
  this.viewportSizeX = ko.observable(0);
  this.viewportSizeY = ko.observable(0);

  this.tiles = ko.observableArray([]);
  this.tilesMatrix;
  this.worldObjects = ko.observableArray([]);
  this.viewportUiElements = ko.observableArray([]);

  this.selectedWorldObject = ko.observable();
  this.activeAction = ko.observable();

  this.viewportStyle = ko.computed(function () {
    var properties = {
      left: (self.viewportX() * self.tileSize * -1) + 'px',
      top: (self.viewportY() * self.tileSize * -1) + 'px',
      width: self.widthInPixels + 'px',
      height: self.heightInPixels + 'px'
    };
    return toCss(properties);
  });

  function initialize() {
    var newTiles = [];
    self.tilesMatrix = [];
    _.times(self.height, function (y) {
      var row = [];
      self.tilesMatrix.push(row);
      _.times(self.width, function (x) {
        var newTile = new WorldTile(self, x, y);
        row.push(newTile);
        newTiles.push(newTile);
      });
    });

    self.tiles(newTiles);

    self.updateViewportSize();
    $(window).on('resize', function () { self.updateViewportSize(); })

    var listener = new window.keypress.Listener();

    listener.simple_combo("d", function () {
      self.moveViewport(1, 0);
    });

    listener.simple_combo("a", function () {
      self.moveViewport(-1, 0);
    });

    listener.simple_combo("s", function () {
      self.moveViewport(0, 1);
    });

    listener.simple_combo("w", function () {
      self.moveViewport(0, -1);
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
  if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
    return this.tilesMatrix[y][x];
  }
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
  var $viewport = $(window);
  this.viewportSizeX(Math.ceil($viewport.width() / this.tileSize));
  this.viewportSizeY(Math.ceil($viewport.height() / this.tileSize));
  this.updateViewportUiElements();
};

World.prototype.moveViewport = function (deltaX, deltaY) {
  var self = this;

  var uiElementsForRemoval = [];
  var uiElementsForAddition = [];

  if (deltaX === 1) {
    for (var y = this.viewportY(); y < (this.viewportY() + this.viewportSizeY()); y++) {
      var row = this.tilesMatrix[y];

      if (row) {
        var tileForRemoval = row[this.viewportX()];
        if (tileForRemoval) {
          uiElementsForRemoval.addAll(tileForRemoval.uiElements());
        }

        var tileForAddition = row[this.viewportX() + this.viewportSizeX()];
        if (tileForAddition) {
          uiElementsForAddition.addAll(tileForAddition.uiElements());
        }
      }
    }
  } else if (deltaX === -1) {
    for (var y = this.viewportY(); y < (this.viewportY() + this.viewportSizeY()); y++) {
      var row = this.tilesMatrix[y];

      if (row) {
        var tileForAddition = row[this.viewportX() - 1];
        if (tileForAddition) {
          uiElementsForAddition.addAll(tileForAddition.uiElements());
        }

        var tileForRemoval = row[this.viewportX() + this.viewportSizeX() - 1];
        if (tileForRemoval) {
          uiElementsForRemoval.addAll(tileForRemoval.uiElements());
        }
      }
    }
  } else if (deltaY === 1) {
    var rowForRemoval = this.tilesMatrix[this.viewportY()];
    var rowForAddition = this.tilesMatrix[this.viewportY() + this.viewportSizeY()];

    for (var x = this.viewportX(); x < (this.viewportX() + this.viewportSizeX()); x++) {
      if (rowForRemoval) {
        var tileForRemoval = rowForRemoval[x];
        if (tileForRemoval) {
          uiElementsForRemoval.addAll(tileForRemoval.uiElements());
        }
      }

      if (rowForAddition) {
        var tileForAddition = rowForAddition[x];
        if (tileForAddition) {
          uiElementsForAddition.addAll(tileForAddition.uiElements());
        }
      }
    }
  } else if (deltaY === -1) {
    var rowForRemoval = this.tilesMatrix[this.viewportY() + this.viewportSizeY() - 1];
    var rowForAddition = this.tilesMatrix[this.viewportY() - 1];

    for (var x = this.viewportX(); x < (this.viewportX() + this.viewportSizeX()); x++) {
      if (rowForRemoval) {
        var tileForRemoval = rowForRemoval[x];
        if (tileForRemoval) {
          uiElementsForRemoval.addAll(tileForRemoval.uiElements());
        }
      }

      if (rowForAddition) {
        var tileForAddition = rowForAddition[x];
        if (tileForAddition) {
          uiElementsForAddition.addAll(tileForAddition.uiElements());
        }
      }
    }
  }

  self.viewportUiElements.removeAll(uiElementsForRemoval);
  self.viewportUiElements.pushAll(uiElementsForAddition);

  this.viewportX(this.viewportX() + deltaX);
  this.viewportY(this.viewportY() + deltaY);
}

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
