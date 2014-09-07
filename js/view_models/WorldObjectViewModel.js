function WorldObjectViewModel(worldObject) {
  this.worldObject = worldObject;
  this.uiElements = ko.observable(_.map(this.worldObject.uiElements, function (uiElement) { return new UIElementViewModel(uiElement); }));
}