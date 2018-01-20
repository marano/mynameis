import { props, signal, state } from "cerebral/tags"
import Button from "./Button"

export default connect(
  {
    sceneName: state`${props`scenePath`}.name`,
    currentSceneSourceScenePath: state`${props`currentScenePath`}.sourceScenePath`,
    sceneClosed: signal`sceneClosed`
  },
  ScenesMenuItem
)

function ScenesMenuItem({
  sceneName,
  scenePath,
  currentScenePath,
  currentSceneSourceScenePath,
  sceneClosed
}) {
  const isSelected =
    scenePath === currentScenePath || scenePath === currentSceneSourceScenePath
  return (
    <div>
      <Button isSelected={isSelected}>{sceneName}</Button>
      <Button
        onClick={linkEvent({ scenePath, sceneClosed }, onCloseSceneButtonClick)}
      >
        x
      </Button>
    </div>
  )
}

function onCloseSceneButtonClick({ scenePath, sceneClosed }) {
  sceneClosed({ scenePath })
}
