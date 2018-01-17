import { Compute } from "cerebral"
import { props, state } from "cerebral/tags"
import { range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export function computeVisibleTileIds(scenePath) {
  return Compute(
    state`${scenePath}.sortedTileIds`,
    state`${scenePath}.viewport.position.x`,
    state`${scenePath}.viewport.position.y`,
    state`${scenePath}.viewport.size.x`,
    state`${scenePath}.viewport.size.y`,
    state`${scenePath}.size.x`,
    state`${scenePath}.size.y`,
    state`${scenePath}.currentMode`,
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

export const computeSelectedWorldObject = Compute(
  state`${props`scenePath`}.selectedWorldObjectId`,
  function(selectedWorldObjectId, get) {
    return get(state`${props`scenePath`}.worldObjects.${selectedWorldObjectId}`)
  }
)

export const computeWorldObjectSelectable = Compute(
  state`editor.objectPicker.selectedEntityIndex`,
  state`${props`scenePath`}.currentMode`,
  function(selectedEntityIndex, mode) {
    return mode === "game" && !selectedEntityIndex
  }
)

export const computeSelectedTile = Compute(
  state`${props`scenePath`}.currentMode`,
  function(mode, get) {
    return get(state`${state`editor.selectedTilePath`}`)
  }
)
