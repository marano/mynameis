import { get } from "lodash"

export default function createEditorActions(state) {
  return {
    objectPickerEntitySelected(entityName) {
      state.editor.objectPicker.selectedEntityName = entityName
    },
    sceneTileSelected(tileId, scenePath) {
      const currentSelectedTile = get(state, state.editor.selectedTilePath)
      if (currentSelectedTile) {
        currentSelectedTile.isSelected = false
      }
      const nextSelectedTilePath = `${scenePath}.tiles.${tileId}`
      const nextSelectedTile = get(state, nextSelectedTilePath)
      nextSelectedTile.isSelected = true
      state.editor.selectedTilePath = nextSelectedTilePath
    }
  }
}
