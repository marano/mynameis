import { observable, action } from "mobx"
import createActions from "./createActions"
import mapValues from "lodash/fp/mapValues"

export default function createStore(initialState) {
  const store = observable(initialState)
  const actions = mapValues(action, createActions(store))
  return { store, actions }
}
