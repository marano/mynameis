import { get } from "lodash"

export const keyHandlers = {
  Escape: function(state, actions) {
    const scene = get(state, state.viewport.currentScenePath)
    if (scene.currentMode === "editor") {
      if (state.editor.objectPicker.selectedEntityName) {
        actions.objectPickerEntitySelected(null)
      } else if (state.editor.selectedTilePath) {
        actions.sceneTileUnselected()
      }
    }
    if (scene.currentMode === "game") {
      if (state.game.selectedWorldObjectPath) {
        actions.worldObjectUnselected()
      }
    }
  }
}

export default function createEventActions(state, computations, actions) {
  return {
    keyPressed(key) {
      keyHandlers[key](state, actions)
    }
  }
}
