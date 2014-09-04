world = undefined;
game = undefined;

$(function () {
  ko.punches.enableAll();
  world = new World();
  game = new GameViewModel(world);
  ko.applyBindings(game);
  world.startTicking();
});
