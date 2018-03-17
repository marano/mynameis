import { curry } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function createWorldObjectComputations(state, computations) {
  return {
    computeFieldOfVisionBoundaries(worldObject) {
      const scene = state.scenes[worldObject.sceneId]
      const tile = scene.tiles[worldObject.tileId]
      const sortedTileIds = computations.computeSortedTileIds(scene)

      const x0 = tile.x
      const y0 = tile.y

      const circle = {}

      const handleTile = curry(handleTileAt)(scene, sortedTileIds, circle)

      let radius = 8
      let x = radius
      let y = 0
      let dx = 1
      let dy = 1
      let err = dx - (radius << 1)

      while (x >= y) {
        handleTile(x0 + x, y0 + y)
        handleTile(x0 + y, y0 + x)
        handleTile(x0 - y, y0 + x)
        handleTile(x0 - x, y0 + y)
        handleTile(x0 - x, y0 - y)
        handleTile(x0 - y, y0 - x)
        handleTile(x0 + y, y0 - x)
        handleTile(x0 + x, y0 - y)

        if (err <= 0) {
          y++
          err += dy
          dy += 2
        }

        if (err > 0) {
          x--
          dx += 2
          err += dx - (radius << 1)
        }
      }

      return circle
    }
  }
}

function handleTileAt(scene, sortedTileIds, circle, x, y) {
  let targetX = capCoordinate(scene.size.x, x)
  let targetY = capCoordinate(scene.size.y, y)
  const tileId = idOfTileAt(sortedTileIds, scene.size.y, targetX, targetY)
  const tile = scene.tiles[tileId]
  circle[tile.id] = true
}

function capCoordinate(sceneSize, value) {
  if (value >= sceneSize) {
    return sceneSize - 1
  } else if (value < 0) {
    return 0
  } else {
    return value
  }
}
