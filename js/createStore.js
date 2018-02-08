import { observable, action, createTransformer, comparer } from "mobx"
import { flow, map, reduce, mapValues, merge } from "lodash/fp"
import { assign } from "lodash"

import createDefinitionActions from "./actions/createDefinitionActions"
import createIdCounterActions from "./actions/createIdCounterActions"
import createSceneActions from "./actions/createSceneActions"
import createViewportActions from "./actions/createViewportActions"
import createEditorActions from "./actions/createEditorActions"
import createGameActions from "./actions/createGameActions"
import createEventActions from "./actions/createEventActions"

import createSceneComputations from "./computations/createSceneComputations"
import createViewportComputations from "./computations/createViewportComputations"
import createTileComputations from "./computations/createTileComputations"

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
    selectedWorldObjectPath: null,
    isMoveControlPressed: false
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
  const createdComputations = flow(
    map(computationCreator => computationCreator(state, computations)),
    reduce(merge, {}),
    mapValues(createTransformer),
    mapValues(withStructuralComparer)
  )([
    createSceneComputations,
    createViewportComputations,
    createTileComputations
  ])
  assign(computations, createdComputations)
  return computations
}

function createActions(state, computations) {
  const actions = {}
  const createdActions = flow(
    map(actionCreator => actionCreator(state, computations, actions)),
    reduce(merge, {}),
    mapValues(action)
  )([
    createDefinitionActions,
    createIdCounterActions,
    createSceneActions,
    createViewportActions,
    createEditorActions,
    createGameActions,
    createEventActions
  ])
  assign(actions, createdActions)
  return actions
}

function withStructuralComparer(originalFunction) {
  return function caller(argument) {
    const defaultComparer = comparer.default
    comparer.default = comparer.structural
    const result = originalFunction(argument)
    comparer.default = defaultComparer
    return result
  }
}
