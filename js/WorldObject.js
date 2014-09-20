function WorldObject(tile, data) {
  var self = this;

  this.world = tile.world;
  this.name = data.name;
  this.uiElements = [];
  this.tickables = [];
  self.activeRoutine = undefined;
  this.cursor = undefined;
  this.selected = ko.observable(false);
  this.selected.subscribe(function (newValue) {
    if (newValue) {
      self.cursor = new UIElement('cursor', self, self.tile());
    } else {
      self.cursor.remove();
    }
  });
  this.selectable = data.selectable;
  this.allowPassThrough = data.allowPassThrough;
  this.tile = ko.observable(tile);
  this.tile.subscribe(function (newTile) {
    _.each(self.uiElements, function (uiElement) { uiElement.tile(newTile); });
  });
  _.each(data.uiElements, function (uiElementName) {
    new UIElement(uiElementName, self, self.tile());
  });
  this.actions = _.map(data['sidebar-actions'], function (action) {
    var actions = {
      'move': MoveAction
    };
    return new actions[action](self);
  });
}

WorldObject.prototype.say = function (content) {
  var balloon = new UIElement('balloon', this, this.tile());
  balloon.content(content);
  new Tickable(this, 3000, function () {
    balloon.remove();
  });
};

WorldObject.prototype.moveTo = function (targetTile, interval) {
  var self = this;

  _.each(this.uiElements, function (uiElement) {
    uiElement.moveTo(targetTile, interval);
  });

  self.tile().worldObjects.remove(self);
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