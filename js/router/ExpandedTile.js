function ExpandedTile(openTile) {
  this.openTile = openTile;
  this.possibleOpenTiles = this.calculatePossibleOpenTiles();
}

ExpandedTile.prototype.calculatePossibleOpenTiles = function () {
  return _.compact([
    this.possibleOpenTile(+0, +1, 1),
    this.possibleOpenTile(+1, +1, 1.4),
    this.possibleOpenTile(+1, +0, 1),
    this.possibleOpenTile(+1, -1, 1.4),
    this.possibleOpenTile(+0, -1, 1),
    this.possibleOpenTile(-1, -1, 1.4),
    this.possibleOpenTile(-1, +0, 1),
    this.possibleOpenTile(-1, +1, 1.4)
  ]);
};

ExpandedTile.prototype.possibleOpenTile = function (xDelta, yDelta, costMultiplier) {
  var targetTile = this.openTile.tile.tileAtDelta(xDelta, yDelta);
  if (targetTile && targetTile.canBePassedThrough()) {
     return new OpenTile(targetTile, this.openTile.destinationTile, costMultiplier * targetTile.movementCost, this.openTile);
  }
};
