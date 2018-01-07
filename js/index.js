import controller from "./controller"

import { definitions as uiElements } from "../json/ui-elements.json"
import { definitions as entities } from "../json/entities.json"
import sceneTemplate from "../json/world.json"

import Main from "./components/Main"

import { mouseMoved } from "./event-subjects"

controller.getSignal("entitiesLoaded")({ entities, uiElements })
controller.getSignal("sceneTemplateLoaded")({ sceneTemplate })

renderRoot(Main)

window.addEventListener(
  "keydown",
  function(event) {
    const mode = controller.getState("currentMode")
    const scenePath = controller.getState(`modes.${mode}.currentScenePath`)

    controller.getSignal("keyPressed")({
      scenePath,
      key: event.key.toLowerCase()
    })
  },
  true
)

function renderRoot(Component) {
  View.render(
    <Container controller={controller}>
      <Component context={{ mouseMoved }} />
    </Container>,
    document.getElementById("root")
  )
}

if (module.hot) {
  module.hot.accept("./components/Main", () =>
    renderRoot(require("./components/Main").default)
  )
}
