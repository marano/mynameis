function OpenTile(tile, destinationTile, cost, fromOpenTile) {
  this.tile = tile;
  this.cost = cost;
  this.totalCostSinceOrigin = this.calculateCost(tile, destinationTile, cost, fromOpenTile);
  this.fromOpenTile = fromOpenTile;
  if (destinationTile.canBePassedThrough()) {
    this.isDestinationTile = tile === destinationTile;
  } else {
    this.isDestinationTile = _([
      destinationTile.tileAtDelta(+0, +1),
      destinationTile.tileAtDelta(+1, +0),
      destinationTile.tileAtDelta(+0, -1),
      destinationTile.tileAtDelta(-1, +0)
    ]).compact().any(function (targetTile) {
      return tile === targetTile;
    });
  }
  this.destinationTile = destinationTile;
}

OpenTile.prototype.path = function () {
  return (this.fromOpenTile ? this.fromOpenTile.path().concat([this]) : []);
};

OpenTile.prototype.calculateCost = function (tile, destinationTile, costFromParent, fromOpenTile) {
  return (fromOpenTile ? fromOpenTile.totalCostSinceOrigin : 0) + costFromParent + tile.distanceFrom(destinationTile);
};