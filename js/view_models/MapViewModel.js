function MapViewModel(world) {
  var self = this;

  self.viewportWidth = world.size;

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return listToMatrix(self.tiles(), self.viewportWidth);
  });

  function initialize() {
    _.times(self.viewportWidth, function (line) {
      _.times(self.viewportWidth, function (row) {
        self.tiles.push(new MapTileViewModel(self, world, line, row));
      });
    });

    world.afterTick(function () { self.worldTicked(); });
  }

  initialize();
}

MapViewModel.prototype.worldTicked = function () {
  _.each(this.tiles(), function (tile) {
    tile.updateWorldUiElements();
  });
};

MapViewModel.prototype.tileAt = function (line, row) {
  return _.find(this.tiles(), function (tile) { return tile.line === line && tile.row === row; });
};

MapViewModel.prototype.selectedTile = function () {
  return _.find(this.tiles(), function (tile) { return tile.selected(); });
};