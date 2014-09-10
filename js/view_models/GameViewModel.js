function GameViewModel(world) {
  var self = this;

  this.world = world;
  this.sidebar = new SidebarViewModel(this);
}