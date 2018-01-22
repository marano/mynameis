import ReactDOM from "react-dom"
import { Provider } from "mobx-react"

import stores from "./stores"

// import { definitions as uiElements } from "../json/ui-elements.json"
// import { definitions as entities } from "../json/entities.json"
// import sceneTemplate from "../json/world.json"
// import setupEvents from "./setup-events"

import Main from "./components/Main"

// controller.getSignal("entitiesLoaded")({ entities, uiElements })
// controller.getSignal("sceneTemplateLoaded")({ sceneTemplate })

renderRoot(Main)

// setupEvents(controller)

if (module.hot) {
  module.hot.accept("./components/Main", () =>
    renderRoot(require("./components/Main").default)
  )
}

function renderRoot(Component) {
  ReactDOM.render(
    <Provider {...stores}>
      <Component abc="abc" />
    </Provider>,
    document.getElementById("root")
  )
}
