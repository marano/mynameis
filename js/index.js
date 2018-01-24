import ReactDOM from "react-dom"
import { Container } from "@cerebral/react"

import controller from "./controller"

import { definitions as uiElements } from "../json/ui-elements.json"
import { definitions as entities } from "../json/entities.json"
import sceneTemplate from "../json/world.json"
import setupEvents from "./setup-events"
import keydownStream from "./streams/keydown"
import createKeydownEventHandler from "./event-handlers/keydown"

import Main from "./components/Main"

controller.getSignal("entitiesLoaded")({ entities, uiElements })
controller.getSignal("sceneTemplateLoaded")({ sceneTemplate })

renderRoot(Main)

const keydownSubscription = keydownStream.subscribe(
  createKeydownEventHandler(controller)
)

setupEvents(controller)

if (module.hot) {
  module.hot.accept("./components/Main", () =>
    renderRoot(require("./components/Main").default)
  )
}

function renderRoot(Component) {
  ReactDOM.render(
    <Container controller={controller}>
      <Component />
    </Container>,
    document.getElementById("root")
  )
}
