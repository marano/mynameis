import { observable, action, createTransformer } from "mobx"
import { flow, mapValues, merge } from "lodash/fp"
import { assign } from "lodash"

import createViewportActions from "./actions/createViewportActions"
import createViewportComputations from "./computations/createViewportComputations"

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
  const computations = createComputations(state)
  const actions = createActions(state, computations)
  return { state, computations, actions }
}

export function extendStore(store) {
  assign(store.computations, createComputations(store.state))
  assign(store.actions, createActions(store.state, store.computations))
}

function createComputations(state) {
  const computations = {}
  assign(computations, createViewportComputations(state, computations))
  assign(computations, mapValues(createTransformer, computations))
  return computations
}

function createActions(state, computations) {
  return flow(
    merge(createViewportActions(state, computations)),
    mapValues(action)
  )({})
}
