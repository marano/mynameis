import { get } from "lodash"

export default function createGameActions(state, computations, actions) {
  return {
    worldObjectSelected(scenePath, worldObjectId) {
      const selectedWorldObject = get(state, state.game.selectedWorldObjectPath)
      if (selectedWorldObject) {
        selectedWorldObject.isSelected = false
      }
      const nextSelectedObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
      state.game.selectedWorldObjectPath = nextSelectedObjectPath
      get(state, nextSelectedObjectPath).isSelected = true
    }
  }
}
