function listToMatrix(list, elementsPerSubArray) {
  var matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
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