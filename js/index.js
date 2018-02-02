import ReactDOM from "react-dom"
// import { Container } from "@cerebral/react"
import { Provider } from "mobx-react"
import DevTools from "mobx-react-devtools"
import { toJS } from "mobx"

import uiElements from "../json/ui-elements.json"
import entities from "../json/entities.json"
// import { initialState } from "./createController"
import { cerebralStateKey } from "./constants"
import { initialState } from "./createStore"

let store
const localState = window.localStorage.getItem(cerebralStateKey)

renderRoot()

if (module.hot) {
  module.hot.accept(["./components/Main", "./createStore"], renderRoot)
}

function renderRoot() {
  const Main = require("./components/Main").default
  const createStore = require("./createStore").default
  const isInitializing = !store
  const state = isInitializing
    ? JSON.parse(localState) || initialState
    : toJS(store.store)

  store = createStore(state)

  if (isInitializing) {
    // controller.getSignal("uiElementsLoaded")({ uiElements })
    // controller.getSignal("entitiesLoaded")({ entities })
  }

  ReactDOM.render(
    <Provider {...store}>
      <Main />
    </Provider>,
    document.getElementById("root")
  )
}
