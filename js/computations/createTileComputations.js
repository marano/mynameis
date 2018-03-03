import { toJS } from "mobx"
import { mapValues, each, curryRight, flatMap } from "lodash"
import { flow, map, uniq, flatten, compact, some } from "lodash/fp"

import { idOfTileAt } from "../tile-utils"

export default function createTileComputations(state, computations) {
  return {
    computeTileTargetedCasts(tile) {
      const opposites = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      }

      const neighbourCasts = mapNeighbours(
        {},
        tile,
        computations.computeTileSourceCasts
      )

      return flow(
        curryRight(flatMap)((tileCast, side) => tileCast[opposites[side]]),
        compact
      )(neighbourCasts)
    },
    computeTileSourceCasts(tile) {
      const scene = state.scenes[tile.sceneId]

      const result = {
        top: [],
        right: [],
        bottom: [],
        left: []
      }

      flow(
        map(worldObjectId => scene.worldObjects[worldObjectId].entityName),
        map(entityName => state.definitions.entities[entityName].uiElements),
        flatten,
        uniq,
        map(uiElementName => state.definitions.uiElements[uiElementName].cast),
        compact,
        map(toJS),
        curryRight(each)(cast => {
          each(cast, (value, side) => {
            result[side].push(value)
          })
        })
      )(tile.worldObjectIds)

      return result
    },
    computeTileNeighbourEntities(tile) {
      return mapNeighbours([], tile, computations.computeTileEntities)
    },
    computeTileEntities(tile) {
      const scene = state.scenes[tile.sceneId]
      return tile.worldObjectIds.map(
        worldObjectId => scene.worldObjects[worldObjectId].entityName
      )
    },
    computeIsTileBlocked(tile) {
      const scene = state.scenes[tile.sceneId]
      return flow(
        map(worldObjectId => scene.worldObjects[worldObjectId].entityName),
        map(entityName => state.definitions.entities[entityName]),
        some("block")
      )(tile.worldObjectIds)
    }
  }

  function mapNeighbours(emptyValue, tile, callback) {
    const scene = state.scenes[tile.sceneId]
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
        const tileId = idOfTileAt(sortedTileIds, scene.size.y, targetX, targetY)
        const tile = scene.tiles[tileId]
        return callback(tile)
      } else {
        return emptyValue
      }
    })
  }
}
