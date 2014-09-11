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

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.goTo = function (targetTile) {
  var self = this;
  var route = new Route(this.tile(), targetTile).solve();

  function go() {
    if (route.length === 0) {
      return;
    } else {
      var moveToTile = _.first(route);
      if (moveToTile.tile.canBePassedThrough()) {
        var interval = self.world.tickInterval * moveToTile.cost;
        self.tile().moveTo(self, moveToTile.tile, interval, function (success) {
          if (success) {
            route.shift();
          }
          go();
        });
      } else {
        self.goTo(targetTile);
      }
    }
  }

  go();
};