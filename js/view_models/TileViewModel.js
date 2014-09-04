function TileViewModel(world, line, row) {
  this.world = world;
  this.line = line;
  this.row = row;
  this.uiElements = ko.observableArray([]);
}

TileViewModel.prototype.updateUiElements = function () {
  this.uiElements(this.worldTile().uiElements());
};

TileViewModel.prototype.worldTile = function () {
  return this.world.tileAt(this.line, this.row);
};

TileViewModel.prototype.worldTile = function () {
  return this.world.tileAt(this.line, this.row);
};