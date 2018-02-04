export default function createEditorActions(state) {
  return {
    objectPickerEntitySelected(entityName) {
      state.editor.objectPicker.selectedEntityName = entityName
    }
  }
}
