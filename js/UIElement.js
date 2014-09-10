function UIElement(worldTileProvider, data) {
  var self = this;
  this.worldTileProvider = worldTileProvider;
  this.image = data.image || data.name;
  this.content = data.content;
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.classesToApply = this.image + (this.animated ? ' animated ' + this.animated : '');
  this.elementId = Math.round((new Date()).getTime() * Math.random());
  this.style = ko.computed(function () {
    if (self.worldTileProvider()) {
      return "left: " + self.worldTileProvider().x * 30 + "px; top: " + self.worldTileProvider().y * 30 + "px;";
    }
  });
}

UIElement.prototype.domElement = function () {
  return $('#' + this.elementId);
};

UIElement.prototype.onClick = function () {
  this.worldTileProvider().onClick();
};