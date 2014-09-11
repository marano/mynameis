function UIElement(tile, world, data) {
  var self = this;
  this.world = world;
  this.image = data.image || data.name;
  this.content = data.content;
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.classesToApply = this.image + (this.animated ? ' animated ' + this.animated : '');
  this.elementId = Math.round((new Date()).getTime() * Math.random());
  this.tile = ko.observable(tile);
  this.style = ko.computed(function () {
    var tile = self.tile();
    return "left: " + tile.x * 30 + "px; top: " + tile.y * 30 + "px;";
  });
}

UIElement.prototype.remove = function () {
  this.world.uiElements.remove(this);
};

UIElement.prototype.domElement = function () {
  return $('#' + this.elementId);
};

UIElement.prototype.onClick = function () {
  this.tile().onClick();
};