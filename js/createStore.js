import { observable, action, createTransformer, comparer, spy } from "mobx"
import { flow, map, reduce, mapValues, merge } from "lodash/fp"
import { assign } from "lodash"

import createIdCounterActions from "./actions/createIdCounterActions"
import createSceneActions from "./actions/createSceneActions"
import createViewportActions from "./actions/createViewportActions"

import createSceneComputations from "./computations/createSceneComputations"
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
  const createdComputations = flow(
    map(computationCreator => computationCreator(state, computations)),
    reduce(
      (allComputations, someComputations) =>
        merge(allComputations, someComputations),
      {}
    ),
    mapValues(createTransformer),
    mapValues(withStructuralComparer)
  )([createSceneComputations, createViewportComputations])
  assign(computations, createdComputations)
  return computations
}

function createActions(state, computations) {
  const actions = {}
  const actionCreators = [
    createIdCounterActions,
    createSceneActions,
    createViewportActions
  ]
  const createdActions = flow(
    map(actionCreator => actionCreator(state, computations, actions)),
    reduce((allActions, someActions) => merge(allActions, someActions), {}),
    mapValues(action)
  )(actionCreators)
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
