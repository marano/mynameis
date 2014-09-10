function WorldTile(world, x, y) {
  var self = this;
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = ko.observableArray([]);
  this.selected = ko.observable(false);
  this.uiElements = ko.computed(function () {
    var computedWorldUiElements = _(self.worldObjects()).map(function (worldObject) {
      return worldObject.uiElements();
    }).flatten().value();
    if (self.selected()) {
      computedWorldUiElements.push(world.worldObjecFactory.createUiElmentOnTile(self, 'cursor'));
    }
    return computedWorldUiElements;
  });
}

WorldTile.prototype.moveWorldObjectHandler = function (worldObject, targetTile, interval, onMoveCompleteCallback) {
  var self = this;
  var callOnCompleteCallback = true;

  _.each(worldObject.uiElements(), function (uiElement) {
    var callOnCompleteCallbackForCurrentElement = callOnCompleteCallback;
    callOnCompleteCallback = false;

    var rollbackMove = function (onRollbackFinished) {
      uiElement.domElement().transition({
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

    var deltaX = targetTile.x === self.x ? 0 : (targetTile.x > self.x ? 30 : -30);
    var deltaY = targetTile.y === self.y ? 0 : (targetTile.y > self.y ? 30 : -30);

    uiElement.domElement().transition({
      x: deltaX,
      y: deltaY,
      complete: function () {
        if (callOnCompleteCallbackForCurrentElement) {
          onMoveCompleteCallback(rollbackMove);
        }
      }
    }, interval, uiElement.movementEase);
  });
}

WorldTile.prototype.canBePassedThrough = function () {
  return _.all(this.worldObjects(), 'allowPassThrough');
};

WorldTile.prototype.moveTo = function (worldObject, targetTile, interval, onMoveCallback) {
  var self = this;
  this.moveWorldObjectHandler(worldObject, targetTile, interval, function (rollbackMove) {
    var success = targetTile.canBePassedThrough();
    if (success) {
      self.worldObjects.remove(worldObject);
      targetTile.addWorldObject(worldObject);
      onMoveCallback(true);
    } else {
      rollbackMove(function () {
        onMoveCallback(false);
      });
    }
  });
};

WorldTile.prototype.addWorldObject = function (worldObject) {
  worldObject.tile(this);
  this.worldObjects.push(worldObject);
};

WorldTile.prototype.distanceFrom = function (anotherTile) {
  return Math.sqrt(Math.pow(this.x - anotherTile.x, 2) + Math.pow(this.y - anotherTile.y, 2));
};

WorldTile.prototype.onClick = function () {
  var activeAction = world.activeAction();
  if (activeAction) {
    activeAction.fulfill(this);
  } else {
    this.select();
  }
};

WorldTile.prototype.select = function () {
  var selectedTile = this.world.selectedTile();
  if (selectedTile && selectedTile !== this) {
    this.world.selectedTile().selected(false);
    this.world.selectedTile(null);
  }
  var selectedWorldObject = this.world.selectedWorldObject();
  if (selectedWorldObject && !_.include(this.worldObjects(), selectedWorldObject)) {
    selectedWorldObject.selected(false);
    this.world.selectedWorldObject(null);
  }
  var selectableWorldObject = _.find(this.worldObjects(), function (worldObject) { return worldObject.selectable; });
  if (selectableWorldObject) {
    this.world.selectedWorldObject(selectableWorldObject);
    selectableWorldObject.selected(true);
  } else {
    this.world.selectedTile(this);
    this.selected(true);
  }
};