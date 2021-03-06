import { get, includes } from "lodash"

import { createWorldObject } from "./helpers"

export default function createEditorActions(state, computations, actions) {
  return {
    objectPickerEntitySelected(entityName) {
      state.editor.objectPicker.selectedEntityName = entityName
    },
    sceneTileUnselected() {
      const currentSelectedTile = get(state, state.editor.selectedTilePath)
      if (currentSelectedTile) {
        currentSelectedTile.isSelected = false
      }
      state.editor.selectedTilePath = null
    },
    sceneTileSelected(tileId, scenePath) {
      actions.sceneTileUnselected()
      const nextSelectedTilePath = `${scenePath}.tiles.${tileId}`
      const nextSelectedTile = get(state, nextSelectedTilePath)
      nextSelectedTile.isSelected = true
      state.editor.selectedTilePath = nextSelectedTilePath
    },
    worldObjectAddedFromPicker(scenePath, tileId) {
      const scene = get(state, scenePath)
      const tile = scene.tiles[tileId]
      const selectedEntityName = state.editor.objectPicker.selectedEntityName
      const selectedEntity = state.definitions.entities[selectedEntityName]
      if (
        !includes(computations.computeTileEntities(tile), selectedEntityName)
      ) {
        createWorldObject(selectedEntity, tile, scene, state, actions)
      }
    }
  }
}
