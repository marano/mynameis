function Route(worldObject, fromTile, toTile) {
  this.worldObject = worldObject;
  this.fromTile = fromTile;
  this.toTile = toTile;
}

Route.prototype.solve = function () {
  var self = this;
  var fromOpenTile = new OpenTile(this.fromTile, this.toTile, 0);
  var openTiles = [fromOpenTile];
  var expandedTiles = [];

  var found = undefined;
  var shouldStop = false;
  while (!shouldStop) {
    var cheapestOpenTileForExpansion = _.min(openTiles, 'totalCostSinceOrigin');
    if (cheapestOpenTileForExpansion) {
      var expandedTile = new ExpandedTile(cheapestOpenTileForExpansion);
      var openTileMatchingDestination = _.find(expandedTile.possibleOpenTiles, 'isDestinationTile');

      if (openTileMatchingDestination) {
        found = openTileMatchingDestination;
        shouldStop = true;
      } else {
        this.handleExpandedTile(expandedTile, openTiles, expandedTiles);
        if (openTiles.length === 0) {
          shouldStop = true;
        }
      }
    } else {
      shouldStop = true;
    }
  }

  if (found) {
    return new Routine(_.map(found.path(), function (openTile) {
      return new MoveRoutineStep(self.worldObject, openTile.tile, openTile.cost);
    }));
  }
};

Route.prototype.handleExpandedTile = function (expandedTile, openTiles, expandedTiles) {
  var possibleTilesWhichWereNotExpandedYet = _.reject(expandedTile.possibleOpenTiles, function (possibleOpenTile) {
    return _.any(expandedTiles, function (expandedTile) {
      return expandedTile.openTile.tile === possibleOpenTile.tile;
    });
  });

  _.each(possibleTilesWhichWereNotExpandedYet, function (possibleTile) {
    var matchingExistentOpenTile = _.find(openTiles, function (existentOpenTile) {
      return existentOpenTile.tile === possibleTile.tile;
    });

    if (matchingExistentOpenTile) {
      if (matchingExistentOpenTile.totalCostSinceOrigin > possibleTile.totalCostSinceOrigin) {
        openTiles.remove(matchingExistentOpenTile);
        openTiles.push(possibleTile);
      }
    } else {
      openTiles.push(possibleTile);
    }
  });

  openTiles.remove(expandedTile.openTile);
  expandedTiles.push(expandedTile);
};
