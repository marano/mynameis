function GameViewModel(world) {
  var self = this;

  this.world = world;
  this.hud = new HudViewModel(this);
}
