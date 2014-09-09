function MoveAction(worldObject) {
  this.worldObject = worldObject;
  this.name = 'move';
  this.active = ko.observable(false);
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