import { connect } from "@cerebral/react"
import { props, signal, state } from "cerebral/tags"
import { linkEvent } from "inferno"

import Button from "./Button"

export default connect(
  {
    sceneName: state`${props`scenePath`}.name`,
    currentSceneSourceScenePath: state`${props`currentScenePath`}.sourceScenePath`,
    sceneChanged: signal`sceneChanged`,
    sceneClosed: signal`sceneClosed`
  },
  ScenesMenuItem
)

function ScenesMenuItem(props) {
  const {
    sceneName,
    scenePath,
    currentScenePath,
    currentSceneSourceScenePath
  } = props
  const isSelected =
    scenePath === currentScenePath || scenePath === currentSceneSourceScenePath
  return (
    <div>
      <Button
        isSelected={isSelected}
        onClick={linkEvent(props, onChangeSceneButtonClick)}
      >
        {sceneName}
      </Button>
      <Button onClick={linkEvent(props, onCloseSceneButtonClick)}>x</Button>
    </div>
  )
}

function onChangeSceneButtonClick({ scenePath, sceneChanged }) {
  sceneChanged({ scenePath })
}

function onCloseSceneButtonClick({ scenePath, sceneClosed }) {
  sceneClosed({ scenePath })
}
