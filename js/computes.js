import { Compute } from "cerebral"
import { props, state } from "cerebral/tags"
import { idOfTileAt } from "./tile-utils"

export const computeWorldObjectSelectable = Compute(
  state`editor.objectPicker.selectedEntityName`,
  state`${props`scenePath`}.currentMode`,
  function(selectedEntityName, mode) {
    return mode === "game" && !selectedEntityName
  }
)

export const computeSelectedTile = Compute(
  state`${props`scenePath`}.currentMode`,
  function(mode, get) {
    return get(state`${state`editor.selectedTilePath`}`)
  }
)

export function computeWorldObjectEntityField(field) {
  return Compute(
    state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.entityName`,
    function(entityName, get) {
      return get(state`definitions.entities.${entityName}.${field}`)
    }
  )
}

export const computeNeighbourEntities = Compute(
  state`${props`scenePath`}.tiles.${props`tileId`}.x`,
  state`${props`scenePath`}.tiles.${props`tileId`}.y`,
  state`${props`scenePath`}.size.x`,
  state`${props`scenePath`}.size.y`,
  state`${props`scenePath`}.sortedTileIds`,
  function(tileX, tileY, sceneSizeX, sceneSizeY, sortedTileIds, get) {
    let result = []

    const leftTileX = tileX - 1
    const leftTileY = tileY

    if (leftTileX > 0 && leftTileX < sceneSizeX) {
      const tileId = idOfTileAt(sortedTileIds, sceneSizeY, leftTileX, leftTileY)
      result = result.concat(getTileEntities(get, tileId))
    }

    return result
  }
)

function getTileEntities(get, tileId) {
  return get(
    state`${props`scenePath`}.tiles.${props`tileId`}.worldObjectIds`
  ).map(worldObjectId =>
    get(state`${props`scenePath`}.worldObjects.${worldObjectId}.entityName`)
  )
}
