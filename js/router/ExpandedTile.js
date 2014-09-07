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

ExpandedTile.prototype.possibleOpenTile = function (xDelta, yDelta, cost) {
  var targetTile = this.tileAtDelta(xDelta, yDelta);
  if (targetTile) {
     return new OpenTile(targetTile, this.openTile.destinationTile, cost, this.openTile);
  }
};

ExpandedTile.prototype.tileAtDelta = function (xDelta, yDelta) {
  return this.openTile.tile.world.tileAt(this.openTile.tile.x + xDelta, this.openTile.tile.y + yDelta);
};