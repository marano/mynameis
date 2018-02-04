import { inject } from "mobx-react"
import { linkEvent } from "inferno"
import { get } from "lodash"

import Button from "./Button"

export default inject(({ state, actions }, { scenePath, currentScenePath }) => {
  const scene = get(state, scenePath)
  return {
    sceneName: scene.name,
    currentSceneSourceScenePath:
      currentScenePath && get(state, currentScenePath).sourceScenePath,
    actions
  }
})(ScenesMenuItem)

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

function onChangeSceneButtonClick({ scenePath, actions: { sceneChanged } }) {
  sceneChanged(scenePath)
}

function onCloseSceneButtonClick({ scenePath, actions: { sceneClosed } }) {
  sceneClosed(scenePath)
}
