import { compute } from "cerebral"
import { state } from "cerebral/tags"
import { range } from "lodash"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export function computeVisibleTileIds(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.sortedTileIds`,
    state`${sceneDataPath}.viewport.position.x`,
    state`${sceneDataPath}.viewport.position.y`,
    state`${sceneDataPath}.viewport.size.x`,
    state`${sceneDataPath}.viewport.size.y`,
    state`${sceneDataPath}.size.x`,
    state`${sceneDataPath}.size.y`,
    state`currentGameMode`,
    function(
      sortedTileIds,
      viewportPositionX,
      viewportPositionY,
      viewportSizeX,
      viewportSizeY,
      sceneSizeX,
      sceneSizeY,
      currentGameMode
    ) {
      const animationOffset = currentGameMode === "play" ? 2 : 0
      const minX = Math.max(0, viewportPositionX - animationOffset)
      const minY = Math.max(0, viewportPositionY - animationOffset)

      const maxX = Math.min(
        viewportPositionX + viewportSizeX + animationOffset,
        sceneSizeX
      )
      const maxY = Math.min(
        viewportPositionY + viewportSizeY + animationOffset,
        sceneSizeY
      )

      var xRange = range(minX, maxX)
      var yRange = range(minY, maxY)

      return cross(xRange, yRange, (x, y) =>
        idOfTileAt(sortedTileIds, sceneSizeY, x, y)
      )
    }
  )
}

export function computeSelectedWorldObject(sceneDataPath) {
  return compute(state`${sceneDataPath}.selectedWorldObjectId`, function(
    worldObjectId,
    get
  ) {
    return get(state`${sceneDataPath}.worldObjects.${worldObjectId}`)
  })
}

export const computeWorldObjectSelectable = compute(
  state`objectPicker.selectedEntityIndex`,
  state`currentGameMode`,
  function(selectedEntityIndex, gameMode) {
    return gameMode === "play" && !selectedEntityIndex
  }
)

export function computeSelectedTile() {
  return compute(state`${state`editor.selectedTilePath`}`)
}

export const computeCurrentSceneDataPath = compute(
  state`currentGameMode`,
  state`game.currentSceneDataPath`,
  state`editor.currentSceneDataPath`,
  function(gameMode, gameSceneDataPath, editorSceneDataPath) {
    if (gameMode === "play") {
      return gameSceneDataPath
    } else if (gameMode === "stop") {
      return editorSceneDataPath
    }
  }
)
