function MapTileViewModel(map, worldTile) {
  var self = this;

  this.map = map;
  this.worldTile = worldTile;
  this.selected = ko.observable(false);
  this.worldObjects = ko.observableArray([]);
  this.worldUiElements = ko.computed(function () {
    var computedWorldUiElements = _(self.worldObjects()).map(function (worldObject) {
      return worldObject.uiElements;
    }).flatten().value();
    if (self.selected()) {
      computedWorldUiElements.push(new UIElement({image: 'selected'}));
    }
    return computedWorldUiElements;
  });

  this.uiElementsClasses = ko.computed(function () {
    return _.pluck(self.worldUiElements(), 'image');
  });

  worldTile.onWorldObjectsUpdated(function (worldObjects) {
    self.updateWorldObjects(worldObjects);
  });
}

MapTileViewModel.prototype.updateWorldObjects = function (worldObjects) {
  this.worldObjects(worldObjects);
};

MapTileViewModel.prototype.onClick = function () {
  if (this.map.game.sidebar.objectMoving()) {
    this.map.game.sidebar.selectMoveTo(this.worldTile);
  } else {
    this.select();
  }
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