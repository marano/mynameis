import { compute } from "cerebral"
import { state } from "cerebral/tags"
import { range } from "lodash"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export function computeVisibleTileIds(scenePath) {
  return compute(
    state`${scenePath}.sortedTileIds`,
    state`${scenePath}.viewport.position.x`,
    state`${scenePath}.viewport.position.y`,
    state`${scenePath}.viewport.size.x`,
    state`${scenePath}.viewport.size.y`,
    state`${scenePath}.size.x`,
    state`${scenePath}.size.y`,
    state`currentMode`,
    function(
      sortedTileIds,
      viewportPositionX,
      viewportPositionY,
      viewportSizeX,
      viewportSizeY,
      sceneSizeX,
      sceneSizeY,
      currentMode
    ) {
      const animationOffset = currentMode === "game" ? 2 : 0
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

export function computeSelectedWorldObject(scenePath) {
  return compute(function(get) {
    const worldObjectId = get(state`${scenePath}.selectedWorldObjectId`)
    return get(state`${scenePath}.worldObjects.${worldObjectId}`)
  })
}

export const computeWorldObjectSelectable = compute(
  state`modes.editor.objectPicker.selectedEntityIndex`,
  state`currentMode`,
  function(selectedEntityIndex, mode) {
    return mode === "game" && !selectedEntityIndex
  }
)

export function computeSelectedTile() {
  return compute(state`${state`modes.editor.selectedTilePath`}`)
}
