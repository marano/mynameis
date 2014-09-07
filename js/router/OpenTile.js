function OpenTile(tile, destinationTile, cost, fromOpenTile) {
  this.tile = tile;
  this.cost = cost;
  this.totalCostSinceOrigin = this.calculateCost(tile, destinationTile, cost, fromOpenTile);
  this.fromOpenTile = fromOpenTile;
  this.isDestinationTile = tile === destinationTile;
  this.destinationTile = destinationTile;
}

OpenTile.prototype.path = function () {
  return (this.fromOpenTile ? this.fromOpenTile.path().concat([this]) : []);
};

OpenTile.prototype.calculateCost = function (tile, destinationTile, costFromParent, fromOpenTile) {
  return (fromOpenTile ? fromOpenTile.totalCostSinceOrigin : 0) + costFromParent + tile.distanceFrom(destinationTile);
};