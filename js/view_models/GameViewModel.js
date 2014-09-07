function GameViewModel(world) {
  var self = this;

  this.map = new MapViewModel(this, world);
  this.sidebar = new SidebarViewModel(this);

  this.worldObjectsSelectedInTile = ko.computed(function () {
    return self.map.selectedTile() ? self.map.selectedTile().worldTile.worldObjects : [];
  });

  setTimeout(function () {
    new Dragdealer('viewport', {
      x: 0,
      y: 1,
      vertical: true,
      speed: 0.2,
      loose: false,
      requestAnimationFrame: true,
      handleClass: 'canvas'
    });
  }, 1000);
}