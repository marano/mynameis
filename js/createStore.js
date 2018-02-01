import { observable, action } from "mobx"
import createActions from "./createActions"
import { flow, mapValues } from "lodash/fp"

export default function createStore(initialState) {
  const store = observable(initialState)
  const actions = flow(createActions, mapValues(action))(store)
  return { store, actions }
}
