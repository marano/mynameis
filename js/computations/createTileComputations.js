import { get } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function createTileComputations(state, computations) {
  return {
    computeTileNeighbourEntities(tile) {
      const scene = get(state, tile.scenePath)
      let result = []

      const sortedTileIds = computations.computeSortedTileIds(scene)

      const leftTileX = tile.x - 1
      const leftTileY = tile.y

      if (leftTileX > 0 && leftTileX < scene.size.x) {
        const tileId = idOfTileAt(
          sortedTileIds,
          scene.size.y,
          leftTileX,
          leftTileY
        )
        const tile = scene.tiles[tileId]
        result = result.concat(computations.computeTileEntities(tile))
      }

      return result
    },
    computeTileEntities(tile) {
      const scene = get(state, tile.scenePath)
      return tile.worldObjectIds.map(
        worldObjectId => scene.worldObjects[worldObjectId].entityName
      )
    }
  }
}
