function PauseAction(world) {
  this.world = world;
  this.name = 'pause';
  this.active = ko.observable(false);
}

PauseAction.prototype.select = function () {
  if (this.active()) {
    this.world.unpause();
    this.active(false);
  } else {
    this.world.pause();
    this.active(true);
  }
};

PauseAction.prototype.unselect = function () {
  this.active(false);
};

PauseAction.prototype.mouseover = function (action, event) {
  animated(event.target, 'pulse');
};