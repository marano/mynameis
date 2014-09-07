function MapViewModel(game, world) {
  var self = this;

  self.game = game;
  self.world = world;

  self.rendered = ko.observable(false);

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return self.tiles().toMatrix(self.world.width);
  });

  self.selectedTile = ko.computed(function () {
    return _.find(self.tiles(), function (tile) { return tile.selected(); });
  });

  function initialize() {
    _.each(self.world.tiles, function (eachWorldTile) {
      self.tiles.push(new MapTileViewModel(self, eachWorldTile));
    });
  }

  initialize();
}