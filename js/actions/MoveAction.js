function MoveAction(worldObject) {
  var self = this;

  this.worldObject = worldObject;
  this.name = 'move';
  this.active = ko.observable(false);
  this.active.subscribe(function (newValue) {
    if (newValue) {
      self.worldObject.world.activeAction(self);
    } else {
      self.worldObject.world.activeAction(null);
    }
  });
}

MoveAction.prototype.select = function (action, event) {
  animated(event.target, 'bounceIn');
  this.active(true);
};

MoveAction.prototype.fulfill = function (targetTile) {
  this.worldObject.goTo(targetTile);
  this.active(false);
};

MoveAction.prototype.mouseover = function (action, event) {
  animated(event.target, 'pulse');
};
