function GameViewModel(world) {

  this.map = new MapViewModel(world);
  this.sidebar = new SidebarViewModel(world);

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

    console.log('dragdealer loaded!')
  }, 1000);
}