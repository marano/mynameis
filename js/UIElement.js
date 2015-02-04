function UIElement(name, owner) {
  var self = this;

  this.owner = owner;

  var data = this.owner.world.worldObjectFactory.uiElementData(name);

  this.followDirection = data.followDirection;
  this.image = _.sample(data.images || []);
  this.content = ko.observable(data.content);
  this.size = data.size;
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.zIndex = data.zIndex;

  this.tile = this.owner.tile;

  this.transitionDuration = ko.observable(0);

  this.classesToApply = ko.computed({read: function () {
    var classes = [data.name];
    if (self.animated) {
      classes.push('animated');
      classes.push(self.animated);
    }
    if (self.followDirection) {
      classes = _.union(classes, self.owner.direction().uiElementClasses);
    }
    return classes.join(' ');
  }, deferEvaluation: true});

  this.style = ko.computed({read: function () {
    var tile = self.tile();
    var styleProperties = {
      left: (tile.x * tile.world.tileSize) + 'px',
      top: (tile.y * tile.world.tileSize) + 'px',
      'transition-duration': self.transitionDuration() + 'ms ,' + self.transitionDuration() + 'ms'
    };
    if (self.movementEase) {
      styleProperties['-webkit-transition-timing-function'] = self.movementEase + ', ' + self.movementEase;
    }
    if (self.image) {
      styleProperties['background-image'] = 'url(/png/' + self.image + '.png)';
    }
    if (self.size) {
      var xOffset = Math.round((tile.world.tileSize - self.size) / 2);
      var yOffset = tile.world.tileSize - self.size;
      styleProperties['background-position-x'] = xOffset + 'px';
      styleProperties['background-position-y'] = yOffset + 'px';
      styleProperties['background-size'] = self.size + 'px ' + self.size + 'px';
    }
    if (self.zIndex) {
      styleProperties['z-index'] = self.zIndex;
    }
    return toCss(styleProperties);
  }, deferEvaluation: true});
}

UIElement.prototype.onClick = function () {
  this.tile().onClick();
};
