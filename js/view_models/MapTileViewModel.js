function MapTileViewModel(map, worldTile) {
  var self = this;

  this.map = map;
  this.worldTile = worldTile;
  this.selected = ko.observable(false);
  this.worldObjects = ko.observableArray([]);
  this.uiElements = ko.computed(function () {
    var computedWorldUiElements = _(self.worldObjects()).map(function (worldObject) {
      return _.map(worldObject.uiElements, function (uiElement) { return new UIElementViewModel(uiElement); });
    }).flatten().value();
    if (self.selected()) {
      computedWorldUiElements.push(new UIElementViewModel(new UIElement({image: 'selected'})));
    }
    return computedWorldUiElements;
  });

  worldTile.onWorldObjectsUpdated(function () {
    self.updateWorldObjects(worldTile.worldObjects);
  });

  worldTile.setMoveWorldObjectHandler(function (object, targetTile, interval, onMoveCompleteCallback) {
    var objectUiElement = _.find(self.uiElements(), function (uiElementViewModel) { return _.contains(object.uiElements, uiElementViewModel.worldUiElement); });

    var rollbackMove = function (onRollbackFinished) {
      objectUiElement.domElement().transition({
        x: 0,
        y: 0,
        duration: 200,
        complete: function () { onRollbackFinished(); }
      });
    };

    var deltaX = targetTile.x === self.worldTile.x ? 0 : (targetTile.x > self.worldTile.x ? 30 : -30);
    var deltaY = targetTile.y === self.worldTile.y ? 0 : (targetTile.y > self.worldTile.y ? 30 : -30);

    objectUiElement.domElement().transition({
      x: deltaY,
      y: deltaX,
      duration: interval,
      complete: function () { onMoveCompleteCallback(rollbackMove); }
    });
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