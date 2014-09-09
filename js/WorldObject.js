function WorldObject(world, data) {
  var self = this;

  this.world = world;
  this.name = data.name;
  this.selected = ko.observable(false);
  this.selectable = data.selectable;
  this.allowPassThrough = data.allowPassThrough;
  this.tile = ko.observable();
  var cursorUiElement = new UIElement({image: 'selected', animated: 'bounceIn'});
  var originalUiElements = _.map(data.uiElements, function (uiElementData) { return new UIElement(uiElementData); });
  this.uiElements = ko.computed(function () {
    var computedUiElements = _.clone(originalUiElements);
    if (self.selected()) {
      computedUiElements.push(cursorUiElement);
    }
    return computedUiElements;
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