import { get } from "lodash"

export default function createGameActions(state, computations, actions) {
  return {
    worldObjectUnselected() {
      const selectedWorldObject = get(state, state.game.selectedWorldObjectPath)
      if (selectedWorldObject) {
        selectedWorldObject.isSelected = false
      }
      state.game.selectedWorldObjectPath = null
    },
    worldObjectSelected(scenePath, worldObjectId) {
      actions.worldObjectUnselected()
      const nextSelectedObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
      state.game.selectedWorldObjectPath = nextSelectedObjectPath
      get(state, nextSelectedObjectPath).isSelected = true
    },
    moveControlPressed() {
      if (state.game.isMoveControlPressed) {
        state.game.isMoveControlPressed = false
      } else {
        state.game.isMoveControlPressed = true
      }
    }
  }
}
