function SidebarViewModel(game) {
  var self = this;

  this.game = game;
  this.pauseAction = new PauseAction(game.world);

  this.worldObjectsFromSelection = ko.computed(function () {
    if (self.game.world.selectedWorldObject()) {
      return [self.game.world.selectedWorldObject()];
    } else if (self.game.world.selectedTile()) {
      return self.game.world.selectedTile().worldObjects();
    } else {
      return [];
    }
  });
}
