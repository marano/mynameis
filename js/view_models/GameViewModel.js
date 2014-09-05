function GameViewModel(world) {
  this.map = new MapViewModel(world);
  this.sidebar = new SidebarViewModel(world);
}
