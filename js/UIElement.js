function UIElement(data) {
  this.image = data.image;
  this.content = data.content;
  this.movementEase = data.movementEase;
  this.animated = data.animated;
  this.classesToApply = this.image + (this.animated ? ' animated ' + this.animated : '');
  this.elementId = Math.round((new Date()).getTime() * Math.random());
}

UIElement.prototype.domElement = function () {
  return $('#' + this.elementId);
};