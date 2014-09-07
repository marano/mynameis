function MapViewModel(world) {
  var self = this;

  self.world = world;

  self.rendered = ko.observable(false);

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return listToMatrix(self.tiles(), self.world.width);
  });

  function initialize() {
    _.times(self.world.height, function (line) {
      _.times(self.world.width, function (row) {
        self.tiles.push(new MapTileViewModel(self, self.world, line, row));
      });
    });

    self.world.afterTick(function () { self.worldTicked(); });
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