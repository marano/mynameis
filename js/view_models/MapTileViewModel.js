function MapTileViewModel(map, worldTile) {
  var self = this;

  this.map = map;
  this.worldTile = worldTile;
  this.selected = ko.observable(false);
  this.worldUiElements = ko.observableArray([]);
  this.uiElementsClasses = ko.computed(function () { return self.computeUiElements(); });

  worldTile.onUiElementsUpdated(function (worldTileUiElements) {
    self.updateWorldUiElements(worldTileUiElements);
  });
}

MapTileViewModel.prototype.updateWorldUiElements = function (worldTileUiElements) {
  this.worldUiElements(worldTileUiElements);
};

MapTileViewModel.prototype.computeUiElements = function () {
  var elementsToAadd = [];
  if (this.selected()) {
    elementsToAadd.push('selected');
  }
  return this.worldUiElements().concat(elementsToAadd);
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