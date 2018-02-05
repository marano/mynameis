import { toJS } from "mobx"
import { get, mapValues } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function createTileComputations(state, computations) {
  return {
    computeTileNeighbourEntities(tile) {
      const scene = get(state, tile.scenePath)

      const sortedTileIds = computations.computeSortedTileIds(scene)

      const sides = {
        top: { x: 0, y: -1 },
        right: { x: +1, y: 0 },
        bottom: { x: 0, y: +1 },
        left: { x: -1, y: 0 }
      }

      return mapValues(sides, (transform, side) => {
        const targetX = tile.x + transform.x
        const targetY = tile.y + transform.y
        if (
          targetX >= 0 &&
          targetX < scene.size.x &&
          targetY >= 0 &&
          targetY < scene.size.y
        ) {
          const tileId = idOfTileAt(
            sortedTileIds,
            scene.size.y,
            targetX,
            targetY
          )
          const tile = scene.tiles[tileId]
          return computations.computeTileEntities(tile)
        } else {
          return []
        }
      })
    },
    computeTileEntities(tile) {
      const scene = get(state, tile.scenePath)
      return tile.worldObjectIds.map(
        worldObjectId => scene.worldObjects[worldObjectId].entityName
      )
    }
  }
}
