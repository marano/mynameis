function MapViewModel(game, world) {
  var self = this;

  self.game = game;
  self.world = world;

  self.rendered = ko.observable(false);

  self.tiles = ko.observableArray([]);

  self.lines = ko.computed(function () {
    return self.tiles().toMatrix(self.world.width);
  });

  self.selectedTile = ko.observable();
  self.selectedWorldObject = ko.observable();

  function initialize() {
    _.each(self.world.tiles, function (eachWorldTile) {
      self.tiles.push(new MapTileViewModel(self, eachWorldTile));
    });
  }

  initialize();
}