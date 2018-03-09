import { get } from "lodash"
import solvePath from "./solvePath"

import { movementDurationCost } from "../constants"

export default function createGameActions(state, computations, actions) {
  return {
    worldObjectUnselected() {
      const selectedWorldObject = get(state, state.game.selectedWorldObjectPath)
      if (selectedWorldObject) {
        selectedWorldObject.isSelected = false
      }
      state.game.selectedWorldObjectPath = null
    },
    moveControlPressed() {
      if (state.game.isMoveControlPressed) {
        state.game.isMoveControlPressed = false
      } else {
        state.game.isMoveControlPressed = true
      }
    },
    worldObjectClicked(scenePath, worldObjectId) {
      const scene = get(state, scenePath)
      if (scene.currentMode === "game") {
        if (state.game.isMoveControlPressed) {
          moveWorldObject(scenePath, worldObjectId)
        } else {
          worldObjectSelected(scenePath, worldObjectId)
        }
      }
    }
  }

  function worldObjectSelected(scenePath, worldObjectId) {
    actions.worldObjectUnselected()
    const nextSelectedObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
    state.game.selectedWorldObjectPath = nextSelectedObjectPath
    get(state, nextSelectedObjectPath).isSelected = true
  }

  function moveWorldObject(scenePath, targetWorldObjectId) {
    const scene = get(state, scenePath)
    const selectedWorldObject = get(state, state.game.selectedWorldObjectPath)
    const originTilePath = `${scenePath}.tiles.${selectedWorldObject.tileId}`
    const targetTilePath = `${scenePath}.tiles.${
      scene.worldObjects[targetWorldObjectId].tileId
    }`

    const originTile = get(state, originTilePath)
    const targetTile = get(state, targetTilePath)

    const sortedTileIds = computations.computeSortedTileIds(scene)
    const path = solvePath(
      originTile,
      targetTile,
      scene,
      sortedTileIds,
      computations.computeIsTileBlocked
    )
    if (path) {
      scene.tickables.push({
        progress: 0,
        steps: path.map(openTile => ({
          subject: selectedWorldObject,
          cost: openTile.costFromParent * movementDurationCost,
          type: "moveTo",
          targetTile: openTile.tile
        }))
      })
    }
  }
}
