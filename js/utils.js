Array.prototype.toMatrix = function (elementsPerSubArray) {
  var matrix = [], i, k;

  for (i = 0, k = -1; i < this.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(this[i]);
  }

  return matrix;
}

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