import ReactDOM from "react-dom"
// import { Container } from "@cerebral/react"
import { Provider } from "mobx-react"
import { toJS } from "mobx"

import uiElements from "../json/ui-elements.json"
import entities from "../json/entities.json"
// import { initialState } from "./createController"
import { cerebralStateKey } from "./constants"
import { defaultState } from "./createStore"

let store
const localState = window.localStorage.getItem(cerebralStateKey)

renderRoot()

if (module.hot) {
  module.hot.accept(["./components/Main", "./createStore"], renderRoot)
}

function renderRoot() {
  const Main = require("./components/Main").default
  const { createStore, extendStore } = require("./createStore")
  const isInitializing = !store

  if (isInitializing) {
    const initialState = isInitializing
      ? JSON.parse(localState) || defaultState
      : toJS(store.store)

    store = createStore(initialState)
    // controller.getSignal("uiElementsLoaded")({ uiElements })
    // controller.getSignal("entitiesLoaded")({ entities })
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
