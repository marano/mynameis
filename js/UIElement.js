function UIElement(name, owner, tile) {
  var self = this;

  this.owner = owner;

  var data = tile.world.worldObjectFactory.uiElementData(name);

  this.followDirection = data.followDirection;
  this.image = _.sample(data.images || []);
  this.content = ko.observable(data.content);
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.classesToApply = ko.computed(function () {
    var classes = [data.name];
    if (self.animated) {
      classes.push('animated');
      classes.push(self.animated);
    }
    if (self.followDirection) {
      classes = _.union(classes, self.owner.direction().uiElementClasses);
    }
    return classes.join(' ');
  });
  this.elementId = Math.round((new Date()).getTime() * Math.random());
  this.transitionDuration = ko.observable(0);
  this.tile = ko.observable(tile);
  this.style = ko.computed(function () {
    var styleProperties = {
      left: self.tile().x * 30 + 'px',
      top: self.tile().y * 30 + 'px',
      '-webkit-transition-timing-function': self.movementEase + ', ' + self.movementEase,
      'transition-delay': 'initial, initial',
      'transition-duration': self.transitionDuration() + 'ms ,' + self.transitionDuration() + 'ms'
    };
    if (self.image) {
      styleProperties['background-image'] = 'url(/png/' + self.image + '.png)';
    }
    return _(styleProperties).map(function (property, value) {
      return value + ': ' + property;
    }).join('; ');
  });

  if (this.owner.uiElements) {
    this.owner.uiElements.push(this);
  }
  tile.world.uiElements.push(this);
}

UIElement.prototype.moveTo = function (targetTile, interval) {
  this.transitionDuration(interval);
  this.tile(targetTile);
};

UIElement.prototype.remove = function () {
  if (this.owner.uiElements) {
    this.owner.uiElements.remove(this);
  }
  this.tile().world.uiElements.remove(this);
};

UIElement.prototype.domElement = function () {
  return $('#' + this.elementId);
};

UIElement.prototype.onClick = function () {
  this.tile().onClick();
};
