import ReactDOM from "react-dom"
import { Container } from "@cerebral/react"

import { definitions as uiElements } from "../json/ui-elements.json"
import { definitions as entities } from "../json/entities.json"
import sceneTemplate from "../json/world.json"
import keydownStream from "./streams/keydown"
import createMoveKeydownStream from "./streams/moveKeydown"
import createKeydownEventHandler from "./event-handlers/keydown"
import createMoveKeydownEventHandler, {
  movementKeys
} from "./event-handlers/moveKeydown"
import createOnMutationStream from "./streams/mutation"
import createOnMutationEventHandler from "./event-handlers/mutation"
import { initialState } from "./createController"

const cerebralStateKey = "cerebralState"

let controller
let keydownSubscription
let moveKeydownSubscription
let mutationSubscription

const localState = window.localStorage.getItem(cerebralStateKey)

renderRoot()

if (module.hot) {
  module.hot.accept(["./components/Main", "./createController"], renderRoot)
}

function renderRoot() {
  const Main = require("./components/Main").default
  const createControllerModule = require("./createController")
  const createController = createControllerModule.default
  const isInitializing = !controller
  const state = isInitializing
    ? JSON.parse(localState) || initialState
    : controller.getState()

  controller = createController(state)

  if (isInitializing) {
    if (!localState) {
      controller.getSignal("entitiesLoaded")({ entities, uiElements })
      controller.getSignal("sceneTemplateLoaded")({ sceneTemplate })
    }
  } else {
    keydownSubscription.unsubscribe()
    moveKeydownSubscription.unsubscribe()
    mutationSubscription.unsubscribe()
  }

  keydownSubscription = keydownStream.subscribe(
    createKeydownEventHandler(controller)
  )

  moveKeydownSubscription = createMoveKeydownStream(movementKeys).subscribe(
    createMoveKeydownEventHandler(controller)
  )

  mutationSubscription = createOnMutationStream(controller).subscribe(
    createOnMutationEventHandler(cerebralStateKey)
  )

  ReactDOM.render(
    <Container controller={controller}>
      <Main />
    </Container>,
    document.getElementById("root")
  )
}
