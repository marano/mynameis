import { Compute } from "cerebral"
import { props, state } from "cerebral/tags"

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
