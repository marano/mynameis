function HudViewModel(game) {
  var self = this;

  this.game = game;
  this.pauseAction = new PauseAction(game.world);

  this.worldObjectsFromSelection = ko.computed(function () {
    var selectedWorldObject = self.game.world.selectedWorldObject();
    if (selectedWorldObject) {
      var tileWorldObjects = _.without(selectedWorldObject.tile().worldObjects(), selectedWorldObject);
      return [selectedWorldObject].concat(tileWorldObjects);
    } else {
      return [];
    }
  });
}
