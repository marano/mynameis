import { compute } from "cerebral"
import { state } from "cerebral/tags"
import { range } from "lodash"
import { cross } from "d3-array"

import indexOfTileAt from "./index-of-tile-at"

export function computeVisibleTileIndexes(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.viewport.position.x`,
    state`${sceneDataPath}.viewport.position.y`,
    state`${sceneDataPath}.viewport.size.x`,
    state`${sceneDataPath}.viewport.size.y`,
    state`${sceneDataPath}.size.x`,
    state`${sceneDataPath}.size.y`,
    state`editor.currentGameMode`,
    function(
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

      return cross(xRange, yRange, (x, y) => indexOfTileAt(sceneSizeY, x, y))
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
  function(selectedEntityIndex) {
    return !selectedEntityIndex
  }
)

export function computeSelectedTile(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.tiles.${state`editor.selectedTileIndex`}`
  )
}
