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
      self.cursor = new UIElement('cursor', self, self);
    } else {
      self.cursor.remove();
    }
  });
  this.canBePassedThrough = ko.computed(function () {
    return _.all(self.worldObjects(), 'allowPassThrough');
  });
}

WorldTile.prototype.tileAtDelta = function (xDelta, yDelta) {
  return this.world.tileAt(this.x + xDelta, this.y + yDelta);
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
