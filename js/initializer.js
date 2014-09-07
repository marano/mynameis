world = undefined;
game = undefined;

$(function () {
  ko.punches.enableAll();
  var worldObjecFactory = new WorldObjecFactory();
  worldObjecFactory.loadData(function () {
    world = new World(worldObjecFactory);
    game = new GameViewModel(world);
    world.loadObjects();
    ko.applyBindings(game);
    world.startTicking();
  });
});
