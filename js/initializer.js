world = undefined;
game = undefined;

$(function () {
  ko.punches.enableAll();
  world = new World();
  game = GameViewModel(world);
  ko.applyBindings(game);
  world.startTicking();
});
