function MapViewModel(world) {
  var self = this;

  self.world = world;

  self.rendered = ko.observable(false);

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return listToMatrix(self.tiles(), self.world.width);
  });

  function initialize() {
    _.each(self.world.tiles, function (eachWorldTile) {
      self.tiles.push(new MapTileViewModel(self, eachWorldTile));
    });
  }

  initialize();
}

MapViewModel.prototype.tileAt = function (line, row) {
  return _.find(this.tiles(), function (tile) { return tile.line === line && tile.row === row; });
};

MapViewModel.prototype.selectedTile = function () {
  return _.find(this.tiles(), function (tile) { return tile.selected(); });
};