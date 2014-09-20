function UIElement(name, holder, tile) {
  var self = this;

  var data = tile.world.worldObjectFactory.uiElementData(name);

  this.holder = holder;
  this.image = data.image || data.name;
  this.content = ko.observable(data.content);
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.classesToApply = this.image + (this.animated ? ' animated ' + this.animated : '');
  this.elementId = Math.round((new Date()).getTime() * Math.random());
  this.transitionDuration = ko.observable(0);
  this.tile = ko.observable(tile);
  this.style = ko.computed(function () {
    var tile = self.tile();
    return _({
      left: tile.x * 30 + 'px',
      top: tile.y * 30 + 'px',
      '-webkit-transition-timing-function': self.movementEase + ', ' + self.movementEase,
      'transition-delay': 'initial, initial',
      'transition-duration': self.transitionDuration() + 'ms ,' + self.transitionDuration() + 'ms'
    }).map(function (property, value) {
      return value + ': ' + property;
    }).join('; ');
  });

  if (this.holder.uiElements) {
    this.holder.uiElements.push(this);
  }
  tile.world.uiElements.push(this);
}

UIElement.prototype.moveTo = function (targetTile, interval) {
  this.transitionDuration(interval);
  this.tile(targetTile);
};

UIElement.prototype.remove = function () {
  if (this.holder.uiElements) {
    this.holder.uiElements.remove(this);
  }
  this.tile().world.uiElements.remove(this);
};

UIElement.prototype.domElement = function () {
  return $('#' + this.elementId);
};

UIElement.prototype.onClick = function () {
  this.tile().onClick();
};