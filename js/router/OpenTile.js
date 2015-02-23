function OpenTile(tile, destinationTile, costFromParent, fromOpenTile) {
  this.tile = tile;
  this.costFromParent = costFromParent;
  this.totalCostSinceOrigin = (fromOpenTile ? fromOpenTile.totalCostSinceOrigin : 0) + costFromParent;
  this.estimatedCostToDestination = this.totalCostSinceOrigin + (tile.distanceFrom(destinationTile) * destinationTile.movementCost);
  this.fromOpenTile = fromOpenTile;
  this.isDestinationTile = tile === destinationTile;
  this.destinationTile = destinationTile;
}

OpenTile.prototype.path = function () {
  return (this.fromOpenTile ? this.fromOpenTile.path().concat([this]) : []);
};
