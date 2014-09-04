function MapViewModel(world) {
  var self = this;

  self.viewportWidth = world.size;

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return listToMatrix(self.tiles(), self.viewportWidth);
  });

  function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    return matrix;
  }

  function initialize() {
    _.times(self.viewportWidth, function (line) {
      _.times(self.viewportWidth, function (row) {
        self.tiles.push(new MapTileViewModel(world, line, row));
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