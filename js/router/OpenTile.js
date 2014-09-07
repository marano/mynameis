function OpenTile(tile, destinationTile, fromOpenTile) {
  this.tile = tile;
  this.cost = this.calculateCost(tile, destinationTile, fromOpenTile);
  this.fromOpenTile = fromOpenTile;
  this.isDestinationTile = tile === destinationTile;
  this.destinationTile = destinationTile;
}

OpenTile.prototype.path = function () {
  return (this.fromOpenTile ? this.fromOpenTile.path().concat([this]) : []);
};

OpenTile.prototype.calculateCost = function (tile, destinationTile, fromOpenTile) {
  return (fromOpenTile ? fromOpenTile.cost + 1 : 0) + tile.distanceFrom(destinationTile);
};