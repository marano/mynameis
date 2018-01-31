import ReactDOM from "react-dom"
// import { Container } from "@cerebral/react"
import { Provider } from "mobx-react"
import DevTools from "mobx-react-devtools"

import uiElements from "../json/ui-elements.json"
import entities from "../json/entities.json"
import { initialState } from "./createController"
import { cerebralStateKey } from "./constants"
import createStore from "./createStore"

let controller
const localState = window.localStorage.getItem(cerebralStateKey)

renderRoot()

if (module.hot) {
  module.hot.accept(["./components/Main", "./createController"], renderRoot)
}

function renderRoot() {
  const Main = require("./components/Main").default
  const createController = require("./createController").default
  const isInitializing = !controller
  const state = isInitializing
    ? JSON.parse(localState) || initialState
    : controller.getState()

  controller = createController(state)

  if (isInitializing) {
    controller.getSignal("uiElementsLoaded")({ uiElements })
    controller.getSignal("entitiesLoaded")({ entities })
  }

  ReactDOM.render(
    <Provider store={createStore(state)}>
      <Main />
    </Provider>,
    document.getElementById("root")
  )
}
