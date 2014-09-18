function UIElementHolder(name, holder, tile) {
  this.holder = holder;
  this.uiElement = new UIElement(name, tile);

  if (this.holder.uiElements) {
    this.holder.uiElements.push(this.uiElement);
  }
  this.holder.world.uiElements.push(this.uiElement);
}

UIElementHolder.prototype.remove = function () {
  if (this.holder.uiElements) {
    this.holder.uiElements.remove(this.uiElement);
  }
  this.holder.world.uiElements.remove(this.uiElement);
};