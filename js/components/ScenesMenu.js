import { connect } from "@cerebral/react"
import { signal, state } from "cerebral/tags"
import { linkEvent } from "inferno"

import ScenesMenuItem from "./ScenesMenuItem"
import Button from "./Button"

export default connect(
  {
    scenePaths: state`editor.scenePaths`,
    newSceneAdded: signal`newSceneAdded`,
    sceneChanged: signal`sceneChanged`
  },
  ScenesMenu
)

function ScenesMenu({ scenePaths, scenePath, newSceneAdded, sceneChanged }) {
  return (
    <div>
      {scenePaths.map(eachScenePath => (
        <ScenesMenuItem
          key={eachScenePath}
          scenePath={eachScenePath}
          currentScenePath={scenePath}
          onClick={linkEvent(
            { sceneChanged, scenePath: eachScenePath },
            onSceneButtonClick
          )}
        />
      ))}
      <Button onClick={linkEvent(newSceneAdded, onNewSceneButtonClick)}>
        New
      </Button>
    </div>
  )
}

function onSceneButtonClick({ sceneChanged, scenePath }) {
  sceneChanged({ scenePath })
}

function onNewSceneButtonClick(newSceneAdded) {
  newSceneAdded()
}
