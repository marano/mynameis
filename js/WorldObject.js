function WorldObject(world, data) {
  var self = this;

  this.world = world;
  this.data = data;
  this.name = data.name;
  this.allowPassThrough = data.allowPassThrough;
  this.uiElements = data.uiElements;
  this.sidebarActions = _.map(data['sidebar-actions'], function (action) {
    return {
      name: action,
      owner: self
    };
  });
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.goTo = function (targetTile) {
  var self = this;
  var route = new Route(this.tile, targetTile).solve();

  function go() {
    if (route.length === 0) {
      return;
    } else {
      var moveToTile = route.pop();
      var interval = self.world.tickInterval * moveToTile.cost;
      setTimeout(function () {
        self.tile.moveTo(self, moveToTile.tile);
        go();
      }, interval);
    }
  }
  go();
};