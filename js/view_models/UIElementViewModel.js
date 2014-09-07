function UIElementViewModel(worldUiElement) {
  this.worldUiElement = worldUiElement;
  this.elementId = Math.round((new Date()).getTime() * Math.random());
}

UIElementViewModel.prototype.domElement = function () {
  return $('#' + this.elementId);
};