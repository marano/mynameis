import { Compute } from "cerebral"
import { props, state } from "cerebral/tags"

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
