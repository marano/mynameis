import { curry } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function createWorldObjectComputations(state, computations) {
  return {
    computeFieldOfVision(worldObject) {
      const scene = state.scenes[worldObject.sceneId]
      const tile = scene.tiles[worldObject.tileId]
      const sortedTileIds = computations.computeSortedTileIds(scene)

      const boundaries = computations.computeFieldOfVisionBoundaries(
        worldObject
      )

      const area = {}

      for (const targetTileId in boundaries) {
        const targetTile = scene.tiles[targetTileId]
        plotLine(
          scene,
          sortedTileIds,
          area,
          computations.computeIsTileBlocked,
          tile.x,
          tile.y,
          targetTile.x,
          targetTile.y
        )
      }

      return area
    },
    computeFieldOfVisionBoundaries(worldObject) {
      const scene = state.scenes[worldObject.sceneId]
      const tile = scene.tiles[worldObject.tileId]
      const sortedTileIds = computations.computeSortedTileIds(scene)

      const x0 = tile.x
      const y0 = tile.y

      const circle = {}

      const handleTile = curry(handleBoundaryTileAt)(
        scene,
        sortedTileIds,
        circle
      )

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

function plotLine(scene, sortedTileIds, area, isTileBlocked, x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0)
  const sx = x0 < x1 ? 1 : -1
  const dy = -Math.abs(y1 - y0)
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy

  let currentX = x0
  let currentY = y0

  while (true) {
    const tile = handleLineTileAt(
      scene,
      sortedTileIds,
      area,
      currentX,
      currentY
    )
    if ((currentX !== x0 || currentY !== y0) && isTileBlocked(tile)) break
    if (currentX === x1 && currentY === y1) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      currentX += sx
    }
    if (e2 <= dx) {
      err += dx
      currentY += sy
    }
  }
}

function handleLineTileAt(scene, sortedTileIds, area, x, y) {
  const tileId = idOfTileAt(sortedTileIds, scene.size.y, x, y)
  area[tileId] = true
  return scene.tiles[tileId]
}

function handleBoundaryTileAt(scene, sortedTileIds, circle, x, y) {
  let targetX = capCoordinate(scene.size.x, x)
  let targetY = capCoordinate(scene.size.y, y)
  const tileId = idOfTileAt(sortedTileIds, scene.size.y, targetX, targetY)
  circle[tileId] = true
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
