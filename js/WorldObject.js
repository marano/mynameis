function WorldObject(tile, data) {
  var self = this;

  this.world = tile.world;
  this.name = data.name;
  this.uiElements = [];
  self.activeRoutine = undefined;
  this.cursor = undefined;
  this.selected = ko.observable(false);
  this.selected.subscribe(function (newValue) {
    if (newValue) {
      self.cursor = world.worldObjecFactory.createUiElmentOnWorldObject(self, 'cursor');
      self.uiElements.push(self.cursor);
    } else {
      self.uiElements.remove(self.cursor);
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
    var uiElement = world.worldObjecFactory.createUiElmentOnWorldObject(self, uiElementName);
    self.uiElements.push(uiElement);
  });
  this.actions = _.map(data['sidebar-actions'], function (action) {
    var actions = {
      'move': MoveAction
    };
    return new actions[action](self);
  });
}

WorldObject.prototype.moveTo = function (targetTile, interval) {
  var self = this;

  _.each(this.uiElements, function (uiElement) {
    uiElement.moveTo(targetTile, interval);
  });

  self.tile().worldObjects.remove(self);
  targetTile.addWorldObject(self);
};

WorldObject.prototype.tick = function () {
  if (this.activeRoutine) {
    this.activeRoutine.tick();

    if (this.activeRoutine.isDone) {
      this.activeRoutine = undefined;
    }
  }
};

WorldObject.prototype.goTo = function (targetTile) {
  this.activeRoutine = new Route(this, this.tile(), targetTile).solve();
};