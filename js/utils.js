Array.prototype.remove = function (element) {
  this.splice(this.indexOf(element), 1);
};

Array.prototype.addAll = function (collection) {
  var self = this;
  _.each(collection, function (element) {
    self.push(element);
  });
};

function animated(element, animation) {
  var animationClasses = animation + ' animated';
  $(element).removeClass(animationClasses).addClass(animationClasses).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $(this).removeClass(animationClasses);
  });
}

function toCss(properties) {
  return _(properties).map(function (property, value) {
    return value + ': ' + property;
  }).join('; ');
};

ko.observableArray.fn.pushAll = function(valuesToPush) {
  var underlyingArray = this();
  this.valueWillMutate();
  ko.utils.arrayPushAll(underlyingArray, valuesToPush);
  this.valueHasMutated();
  return this;
};
