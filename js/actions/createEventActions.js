import { get } from "lodash"

export const keyHandlers = {
  Escape: function(state, actions) {
    const scene = get(state, state.viewport.currentScenePath)
    if (scene.currentMode === "editor") {
      actions.objectPickerEntitySelected(null)
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
