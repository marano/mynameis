import { observable, action } from "mobx"
import createActions from "./actions/createActions"
import { flow, mapValues } from "lodash/fp"

export const initialState = {
  idCounters: {},
  scenes: {},
  viewport: {
    currentScenePath: null,
    containerDimension: {
      width: null,
      height: null
    }
  },
  editor: {
    selectedTilePath: null,
    objectPicker: {
      selectedEntityName: null
    },
    scenePaths: []
  },
  game: {
    selectedWorldObjectPath: null
  },
  definitions: {
    uiElements: [],
    entities: []
  }
}

export default function createStore(initialState) {
  const store = observable(initialState)
  const actions = flow(createActions, mapValues(action))(store)
  return { store, actions }
}
