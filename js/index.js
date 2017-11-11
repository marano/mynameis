import controller from "./controller"

import { definitions as uiElements } from "../json/ui-elements.json"
import { definitions as entities } from "../json/entities.json"
import sceneTemplate from "../json/world.json"

import Main from "./components/Main"

controller.getSignal("entitiesLoaded")({ entities, uiElements })
controller.getSignal("sceneTemplateLoaded")({ sceneTemplate })

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

View.render(
  <Container controller={controller}>
    <Main />
  </Container>,
  document.getElementById("root")
)
