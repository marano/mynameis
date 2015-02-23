function WorldTile(world, x, y) {
  var self = this;

  this.world = world;
  this.x = x;
  this.y = y;
  this.movementCost = 5;
  this.worldObjects = ko.observableArray([]);
  this.uiElements = ko.computed({read: function () {
    return _(self.worldObjects()).map(function (worldObject) {
      return worldObject.uiElements();
    }).flatten().value();
  }, deferEvaluation: true});
  this.canBePassedThrough = ko.computed(function () {
    return _.all(self.worldObjects(), 'allowPassThrough');
  });

  this.visibleInViewport = ko.computed({read: function () {
    return self.x >= self.world.viewportX() &&
           self.x < (self.world.viewportX() + self.world.viewportSizeX()) &&
           self.y >= self.world.viewportY() &&
           self.y < (self.world.viewportY() + self.world.viewportSizeY());
  }, deferEvaluation: true});
}

WorldTile.prototype.tileAtDelta = function (xDelta, yDelta) {
  return this.world.tileAt(this.x + xDelta, this.y + yDelta);
};

WorldTile.prototype.addWorldObject = function (worldObject) {
  worldObject.tile().worldObjects.remove(worldObject);
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
    this.selectWorldObject();
  }
};

WorldTile.prototype.selectWorldObject = function () {
  var worldObjectForSelection = _.max(this.worldObjects() , function (worldObject) {
    return worldObject.selectionPriority;
  });
  if (worldObjectForSelection) {
    worldObjectForSelection.selected(true);
  }
};
