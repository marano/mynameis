function MapTileViewModel(map, worldTile) {
  var self = this;

  this.map = map;
  this.worldTile = worldTile;
  this.selected = ko.observable(false);
  this.worldObjects = ko.observableArray([]);
  var cursorUiElement = new UIElementViewModel(new UIElement({image: 'selected', animated: 'bounceIn'}));
  this.uiElements = ko.computed(function () {
    var computedWorldUiElements = _(self.worldObjects()).map(function (worldObject) {
      return worldObject.uiElements();
    }).flatten().value();
    if (self.selected()) {
      computedWorldUiElements.push(cursorUiElement);
    }
    return computedWorldUiElements;
  });

  worldTile.onWorldObjectsUpdated(function () {
    self.updateWorldObjects();
  });

  worldTile.setMoveWorldObjectHandler(function (worldObject, targetTile, interval, onMoveCompleteCallback) {
    var callOnCompleteCallback = true;

    _.each(_.find(self.worldObjects(), function (worldObjectViewModel) {
      return worldObjectViewModel.worldObject === worldObject;
    }).uiElements(), function (uiElementViewModel) {
      var callOnCompleteCallbackForCurrentElement = callOnCompleteCallback;
      callOnCompleteCallback = false;

      var rollbackMove = function (onRollbackFinished) {
        uiElementViewModel.domElement().transition({
          x: 0,
          y: 0,
          duration: 200,
          complete: function () {
            if (callOnCompleteCallbackForCurrentElement) {
              onRollbackFinished();
            }
          }
        });
      };

      var deltaX = targetTile.x === self.worldTile.x ? 0 : (targetTile.x > self.worldTile.x ? 30 : -30);
      var deltaY = targetTile.y === self.worldTile.y ? 0 : (targetTile.y > self.worldTile.y ? 30 : -30);

      uiElementViewModel.domElement().transition({
        x: deltaY,
        y: deltaX,
        complete: function () {
          if (callOnCompleteCallbackForCurrentElement) {
            onMoveCompleteCallback(rollbackMove);
          }
        }
      }, interval, uiElementViewModel.worldUiElement.movementEase);
    });
  });
}

MapTileViewModel.prototype.updateWorldObjects = function () {
  this.worldObjects(_.map(this.worldTile.worldObjects, function (worldObject) {
    return new WorldObjectViewModel(worldObject);
  }));
};

MapTileViewModel.prototype.onClick = function (action, event) {
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