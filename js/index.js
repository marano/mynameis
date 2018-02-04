import ReactDOM from "react-dom"
import { Provider } from "mobx-react"

import { cerebralStateKey } from "./constants"
import { defaultState } from "./createStore"

import uiElements from "../json/ui-elements.json"
import entities from "../json/entities.json"

let store

renderRoot()

if (module.hot) {
  module.hot.accept(["./components/Main", "./createStore"], renderRoot)
}

function renderRoot() {
  const Main = require("./components/Main").default
  const { createStore, extendStore } = require("./createStore")
  const isInitializing = !store

  if (isInitializing) {
    const localState = window.localStorage.getItem(cerebralStateKey)
    const initialState = JSON.parse(localState) || defaultState
    store = createStore(initialState)
    store.actions.uiElementsLoaded(uiElements.definitions)
    store.actions.entitiesLoaded(entities.definitions)
  } else {
    extendStore(store)
  }

  ReactDOM.render(
    <Provider {...store}>
      <Main />
    </Provider>,
    document.getElementById("root")
  )
}
