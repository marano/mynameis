function GameViewModel(world) {
  var self = {
    viewportWidth: world.size
  };

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return listToMatrix(self.tiles(), self.viewportWidth);
  });

  self.worldTicked = function () {
    _.each(self.tiles(), function (tile) { tile.updateUiElements(); });
  };

  self.tileAt = function (line, row) {
    return _.find(self.tiles(), function (tile) { return tile.line === line && tile.row === row; });
  };

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
        self.tiles.push(new TileViewModel(world, line, row));
      });
    });

    world.afterTick(self.worldTicked);
  }

  initialize();

  return self;
}
