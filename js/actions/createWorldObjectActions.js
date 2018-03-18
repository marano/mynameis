import { get, includes } from "lodash"

import { movementAnimationCleanupDelay } from "../constants"

export default function createWorldObjectActions(state, computations, actions) {
  return {
    worldObjectMoved(worldObject, targetTile) {
      const scene = state.scenes[worldObject.sceneId]
      const currentTile = scene.tiles[worldObject.tileId]
      const worldObjectIdIndex = currentTile.worldObjectIds.indexOf(
        worldObject.id
      )
      currentTile.worldObjectIds.splice(worldObjectIdIndex, 1)
      const nextTile = scene.tiles[targetTile.id]
      nextTile.worldObjectIds.push(worldObject.id)
      worldObject.tileId = nextTile.id
      worldObject.previousTileId = currentTile.id

      if (nextTile.x > currentTile.x) {
        worldObject.flipped = true
      } else if (nextTile.x < currentTile.x) {
        worldObject.flipped = false
      }

      setTimeout(
        () => actions.clearPreviousTileId(worldObject),
        movementAnimationCleanupDelay
      )
    },
    clearPreviousTileId(worldObject) {
      worldObject.previousTileId = null
    },
    removeWorldObject(worldObject) {
      const scene = state.scenes[worldObject.sceneId]
      const tile = scene.tiles[worldObject.tileId]
      delete scene.worldObjects[worldObject.id]
      const index = tile.worldObjectIds.indexOf(worldObject.id)
      tile.worldObjectIds.splice(index, 1)
      const entity = state.definitions.entities[worldObject.entityName]
      if (includes(entity.roles, "player-character")) {
        const playerCharactersIndex = tile.playerCharacterWorldObjectIds.indexOf(
          worldObject.id
        )
        scene.playerCharacterWorldObjectIds.splice(playerCharactersIndex, 1)
      }
      if (
        state.game.selectedWorldObjectPath ===
        `scenes.${scene.id}.worldObjects.${worldObject.id}`
      ) {
        state.game.selectedWorldObjectPath = null
      }
    }
  }
}
