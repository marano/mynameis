function MapTileViewModel(world, line, row) {
  this.world = world;
  this.line = line;
  this.row = row;
  this.uiElements = ko.observableArray([]);
  this.selected = ko.observable(false);
}

MapTileViewModel.prototype.updateUiElements = function () {
  this.uiElements(this.worldTile().uiElements());
};

MapTileViewModel.prototype.worldTile = function () {
  return this.world.tileAt(this.line, this.row);
};

MapTileViewModel.prototype.select = function () {
  this.selected(true);
};

MapTileViewModel.prototype.unselect = function () {
  this.selected(false);
};