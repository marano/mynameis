function WorldObject(tile, data) {
  var self = this;

  this.data = data;
  this.name = data.name;
  this.sidebarActions = _.map(data['sidebar-actions'], function (action) {
    return {
      name: action,
      owner: self
    };
  });
}

WorldObject.prototype.tick = function () {
};

WorldObject.prototype.uiElements = function () {
  return this.data.uiElements;
};

WorldObject.prototype.goTo = function (targetTile) {
  var self = this;
  var route = new Route(this.tile, targetTile).solve();

  function go() {
    setTimeout(function () {
      self.tile.moveTo(self, route.pop().tile);
      if (route.length > 0) {
        go();
      }
    }, 500);
  }
  go();
};