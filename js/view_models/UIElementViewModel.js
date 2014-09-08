function UIElementViewModel(worldUiElement) {
  this.worldUiElement = worldUiElement;
  this.classesToApply = worldUiElement.image + (worldUiElement.animated ? ' animated ' + worldUiElement.animated : '');
  this.elementId = Math.round((new Date()).getTime() * Math.random());
}

UIElementViewModel.prototype.domElement = function () {
  return $('#' + this.elementId);
};