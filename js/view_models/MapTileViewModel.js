function MapTileViewModel(map, world, line, row) {
  var self = this;

  this.map = map;
  this.world = world;
  this.line = line;
  this.row = row;
  this.selected = ko.observable(false);
  this.worldUiElements = ko.observableArray([]);
  this.uiElementsClasses = ko.computed(function () { return self.computeUiElements().join(' '); });
}

MapTileViewModel.prototype.updateWorldUiElements = function () {
  this.worldUiElements(this.worldTile().uiElements());
};

MapTileViewModel.prototype.computeUiElements = function () {
  var elementsToAadd = [];
  if (this.selected()) {
    elementsToAadd.push('selected');
  }
  return this.worldUiElements().concat(elementsToAadd);
};

MapTileViewModel.prototype.worldTile = function () {
  return this.world.tileAt(this.line, this.row);
};

MapTileViewModel.prototype.select = function () {
  var selectedTile = this.map.selectedTile();
  if (selectedTile && selectedTile !== this) {
    selectedTile.unselect();
  }
  this.selected(true);
};

MapTileViewModel.prototype.unselect = function () {
  this.selected(false);
};