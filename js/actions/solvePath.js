import { compact, find, some, minBy, reject, each } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function solvePath(
  originTile,
  destinationTile,
  scene,
  sortedTileIds,
  computeIsTileBlocked
) {
  const fromOpenTile = createOpenTile(originTile, destinationTile, 0, null)
  const openTiles = [fromOpenTile]
  const expandedTiles = []

  let found = null
  let shouldStop = false

  // console.log("destinationTile", destinationTile.x, destinationTile.y)
  while (!shouldStop) {
    const cheapestOpenTileForExpansion = minBy(
      openTiles,
      "estimatedCostToDestination"
    )
    // console.log(
    //   "cheapestOpenTileForExpansion",
    //   cheapestOpenTileForExpansion.tile.x,
    //   cheapestOpenTileForExpansion.tile.y
    // )
    if (cheapestOpenTileForExpansion) {
      const expandedTile = createExpandedTile(
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        cheapestOpenTileForExpansion,
        destinationTile
      )
      const openTileMatchingDestination = find(
        expandedTile.possibleOpenTiles,
        "isDestinationTile"
      )

      if (openTileMatchingDestination) {
        found = openTileMatchingDestination
        shouldStop = true
      } else {
        handleExpandedTile(expandedTile, openTiles, expandedTiles)
        if (openTiles.length === 0) {
          shouldStop = true
        }
      }
    } else {
      shouldStop = true
    }
  }

  if (found) {
    return buildPath(found, originTile)
  }
}

function buildPath(openTileMatchingDestination, originTile) {
  const path = []
  let currentOpenTile = openTileMatchingDestination
  while (currentOpenTile.tile !== originTile) {
    path.unshift(currentOpenTile)
    currentOpenTile = currentOpenTile.fromOpenTile
  }
  return path
}

function handleExpandedTile(expandedTile, openTiles, expandedTiles) {
  var possibleTilesWhichWereNotExpandedYet = reject(
    expandedTile.possibleOpenTiles,
    function(possibleOpenTile) {
      return some(expandedTiles, function(expandedTile) {
        return expandedTile.openTile.tile === possibleOpenTile.tile
      })
    }
  )

  each(possibleTilesWhichWereNotExpandedYet, function(possibleTile) {
    var matchingExistentOpenTile = find(openTiles, function(existentOpenTile) {
      return existentOpenTile.tile === possibleTile.tile
    })

    if (matchingExistentOpenTile) {
      if (
        matchingExistentOpenTile.totalCostSinceOrigin >
        possibleTile.totalCostSinceOrigin
      ) {
        removeItemFromArray(matchingExistentOpenTile, openTiles)
        openTiles.push(possibleTile)
      }
    } else {
      openTiles.push(possibleTile)
    }
  })

  removeItemFromArray(expandedTile.openTile, openTiles)
  expandedTiles.push(expandedTile)
}

function removeItemFromArray(item, array) {
  array.splice(array.indexOf(item), 1)
}

function createOpenTile(tile, destinationTile, costFromParent, fromOpenTile) {
  const totalCostSinceOrigin =
    (fromOpenTile ? fromOpenTile.totalCostSinceOrigin : 0) + costFromParent
  const estimatedCostToDestination =
    totalCostSinceOrigin + distance(tile, destinationTile)
  const isDestinationTile = tile === destinationTile

  // console.log(
  //   "createOpenTile",
  //   tile.x,
  //   tile.y,
  //   totalCostSinceOrigin,
  //   estimatedCostToDestination,
  //   isDestinationTile,
  //   tile,
  //   destinationTile
  // )
  return {
    tile,
    costFromParent,
    totalCostSinceOrigin,
    estimatedCostToDestination,
    fromOpenTile,
    isDestinationTile
  }
}

function createExpandedTile(
  scene,
  sortedTileIds,
  computeIsTileBlocked,
  openTile,
  destinationTile
) {
  // console.log("createExpandedTile", openTile.tile.x, openTile.tile.y)
  const movementCost = 1
  return {
    openTile: openTile,
    possibleOpenTiles: compact([
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        +0,
        +1,
        1
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        +1,
        +1,
        1.4
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        +1,
        +0,
        1
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        +1,
        -1,
        1.4
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        +0,
        -1,
        1
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        -1,
        -1,
        1.4
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        -1,
        +0,
        1
      ),
      tileAtDelta(
        openTile,
        scene,
        sortedTileIds,
        computeIsTileBlocked,
        -1,
        +1,
        1.4
      )
    ]).map(({ tile, costFromParent }) =>
      createOpenTile(
        tile,
        destinationTile,
        costFromParent * movementCost,
        openTile
      )
    )
  }
}

function tileAtDelta(
  openTile,
  scene,
  sortedTileIds,
  computeIsTileBlocked,
  deltaX,
  deltaY,
  costFromParent
) {
  const targetX = openTile.tile.x + deltaX
  const targetY = openTile.tile.y + deltaY
  if (
    targetX >= 0 &&
    targetX < scene.size.x &&
    targetY >= 0 &&
    targetY < scene.size.y
  ) {
    const tileId = idOfTileAt(sortedTileIds, scene.size.y, targetX, targetY)
    const tile = scene.tiles[tileId]
    if (!computeIsTileBlocked(tile)) {
      return { tile, costFromParent }
    }
  }
}

function distance(aTile, anotherTile) {
  return Math.sqrt(
    Math.pow(aTile.x - anotherTile.x, 2) + Math.pow(aTile.y - anotherTile.y, 2)
  )
}
