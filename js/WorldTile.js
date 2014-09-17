function WorldTile(world, x, y) {
  var self = this;
  this.world = world;
  this.x = x;
  this.y = y;
  this.worldObjects = ko.observableArray([]);
  this.cursor = undefined;
  this.selected = ko.observable(false);
  this.selected.subscribe(function (newValue) {
    if (newValue) {
      this.cursor = world.worldObjecFactory.createUiElmentOnTile(self, 'cursor');
    } else {
      this.cursor.remove();
    }
  });
}

WorldTile.prototype.tileAtDelta = function (xDelta, yDelta) {
  return this.world.tileAt(this.x + xDelta, this.y + yDelta);
};

WorldTile.prototype.canBePassedThrough = function () {
  return _.all(this.worldObjects(), 'allowPassThrough');
};

WorldTile.prototype.moveTo = function (worldObject, targetTile, interval, onMoveCallback) {
  var self = this;

  _.each(worldObject.uiElements, function (uiElement) {
    uiElement.moveTo(targetTile, interval);
  });

  setTimeout(function () {
    self.worldObjects.remove(worldObject);
    targetTile.addWorldObject(worldObject);
    onMoveCallback();
  }, interval);
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