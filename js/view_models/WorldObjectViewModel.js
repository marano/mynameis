function WorldObjectViewModel(worldObject) {
  var self = this;
  this.worldObject = worldObject;
  this.selected = ko.observable(worldObject.selected);
  this.selected.subscribe(function (newValue) {
    self.worldObject.selected = newValue;
  });
  var cursorUiElement = new UIElementViewModel(new UIElement({image: 'selected', animated: 'bounceIn'}));
  this.uiElements = ko.computed(function () {
    var worldObjectUiElements = _.map(self.worldObject.uiElements, function (uiElement) {
      return new UIElementViewModel(uiElement);
    });
    if (self.selected()) {
      worldObjectUiElements.push(cursorUiElement);
    }
    return worldObjectUiElements;
  });
}