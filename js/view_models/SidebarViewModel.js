function SidebarViewModel(game) {
  var self = this;

  this.game = game;
  this.moving = ko.observable(false);
  this.objectMoving = ko.observable();

  this.worldObjectsFromSelection = ko.computed(function () {
    if (self.game.map.selectedWorldObject()) {
      return [self.game.map.selectedWorldObject()];
    } else if (self.game.map.selectedTile()) {
      return self.game.map.selectedTile().worldObjects();
    } else {
      return [];
    }
  });
}

SidebarViewModel.prototype.mouseover = function (action, event) {
  animated(event.target, 'pulse');
};

SidebarViewModel.prototype.initiateMoveToSelection = function (action, event) {
  animated(event.target, 'bounceIn');
  this.moving(true);
  this.objectMoving(action.owner);
};

SidebarViewModel.prototype.selectMoveTo = function (tile) {
  if (this.objectMoving()) {
    this.objectMoving().goTo(tile);

    this.moving(false);
    this.objectMoving(null);
  }
};
