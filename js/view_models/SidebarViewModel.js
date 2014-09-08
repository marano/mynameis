function SidebarViewModel(game) {
  this.game = game;
  this.moving = ko.observable(false);
  this.objectMoving = ko.observable();
}

SidebarViewModel.prototype.mouseover = function (action, event) {
  animated(event.target, 'pulse');
};

SidebarViewModel.prototype.initiateMoveToSelection = function (action) {
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

function animated(element, animation) {
  $(element).removeClass(animation + ' animated').addClass(animation + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $(this).removeClass(animation + ' animated');
  });
}