function WorldObject(tile, data) {
  var self = this;

  this.world = tile.world;
  this.name = data.name;
  this.dataUiElements = [];
  this.tickables = [];
  this.activeRoutine = undefined;
  this.cursorUiElement = ko.observable(null);
  this.speachBalloonUiElement = ko.observable(null);
  this.selected = ko.observable(false);
  this.selected.subscribe(function (newValue) {
    if (newValue) {
      if (self.world.selectedWorldObject()) {
        self.world.selectedWorldObject().selected(false);
      }
      self.cursorUiElement(new UIElement('cursor', self));
      self.world.uiElementCreated(self.cursorUiElement());
    } else {
      self.world.uiElementRemoved(self.cursorUiElement());
      self.cursorUiElement(null);
    }
  });
  this.selectionPriority = data.selectionPriority || 0;
  this.allowPassThrough = data.allowPassThrough;
  this.direction = ko.observable(_.sample(Direction.ALL_DIRECTIONS));
  this.actions = _.map(data['hud-actions'], function (action) {
    var actions = {
      'move': MoveAction
    };
    return new actions[action](self);
  });
  this.tile = ko.observable(tile);
  this.previousTile = undefined;
  _.each(data.uiElements, function (uiElementName) {
    var newUiElement = new UIElement(uiElementName, self);
    self.dataUiElements.push(newUiElement);
    self.world.uiElementCreated(newUiElement);
  });
  this.uiElements = ko.computed({read: function () {
    return _(self.dataUiElements).concat([self.cursorUiElement(), self.speachBalloonUiElement()]).compact().value();
  }, deferEvaluation: true});
  this.tile.subscribe(function (targetTile) {
    self.world.worldObjectMovedToTile(self, targetTile, self.previousTile);
    self.previousTile = targetTile;
  });
}

WorldObject.prototype.say = function (content) {
  var self = this;
  var balloon = new UIElement('balloon', this);
  this.speachBalloonUiElement(balloon);
  balloon.content(content);
  this.world.uiElementCreated(balloon);
  new Tickable(this, 3000, function () {
    self.world.uiElementRemoved(self.speachBalloonUiElement());
    self.speachBalloonUiElement(null);
  });
};

WorldObject.prototype.moveTo = function (targetTile, interval) {
  var self = this;

  _.each(this.uiElements(), function (uiElement) {
    uiElement.transitionDuration(interval);
  });

  targetTile.addWorldObject(self);
};

WorldObject.prototype.tick = function () {
  _.each(this.tickables, function (tickable) {
    tickable.tick();
  });

  if (this.activeRoutine) {
    this.activeRoutine.tick();

    if (this.activeRoutine.isDone) {
      this.activeRoutine = undefined;
    }
  }
};

WorldObject.prototype.goTo = function (targetTile) {
  this.activeRoutine = new Route(this, this.tile(), targetTile).solve();
  this.say("Let's go there!");
};

WorldObject.prototype.lookAt = function (thatTile) {
  var thisTile = this.tile();
  var deltaX = thisTile.x - thatTile.x;
  var deltaY = thisTile.y - thatTile.y;
  if (deltaX === 0 && deltaY > 0) {
    this.direction(Direction.NORTH);
  } else if (deltaX === 0 && deltaY < 0) {
    this.direction(Direction.SOUTH);
  } else if (deltaY === 0 && deltaX > 0) {
    this.direction(Direction.WEST);
  } else if (deltaY === 0 && deltaX < 0) {
    this.direction(Direction.EAST);
  } else if (deltaX > 0 && deltaY > 0) {
    this.direction(Direction.NORTHWEST);
  } else if (deltaX > 0 && deltaY < 0) {
    this.direction(Direction.SOUTHWEST);
  } else if (deltaX < 0 && deltaY > 0) {
    this.direction(Direction.NORTHEAST);
  } else if (deltaX < 0 && deltaY < 0) {
    this.direction(Direction.SOUTHEAST);
  }
};
