function WorldObject(tile, data) {
  var self = this;

  this.world = tile.world;
  this.name = data.name;
  this.uiElements = [];
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

WorldObject.prototype.moveTo = function (targetTile, interval, onMoveCallback) {
  var self = this;

  _.each(this.uiElements, function (uiElement) {
    uiElement.moveTo(targetTile, interval);
  });

  setTimeout(function () {
    self.tile().worldObjects.remove(self);
    targetTile.addWorldObject(self);
    onMoveCallback();
  }, interval);
};

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.goTo = function (targetTile) {
  var self = this;
  var route = new Route(this.tile(), targetTile).solve();

  function go() {
    if (route.length === 0) {
      return;
    } else {
      var movement = route.shift();
      if (movement.tile.canBePassedThrough()) {
        var interval = self.world.tickInterval * movement.cost;
        self.moveTo(movement.tile, interval, function () {
          go();
        });
      } else {
        self.goTo(targetTile);
      }
    }
  }

  go();
};