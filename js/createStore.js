import { observable, action } from "mobx"
import createViewportActions from "./actions/createViewportActions"
import { flow, mapValues, merge } from "lodash/fp"
import { assign } from "lodash"

export const defaultState = {
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

export function createStore(initialState) {
  const state = observable(initialState)
  const actions = createActions(state)
  return { state, actions }
}

export function extendStore(store) {
  assign(store.actions, createActions(store.state))
}

function createActions(state) {
  return flow(merge(createViewportActions(state)), mapValues(action))({})
}
