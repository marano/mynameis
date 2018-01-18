import { props, state } from "cerebral/tags"
import Button from "./Button"

export default connect(
  {
    sceneName: state`${props`scenePath`}.name`,
    currentSceneSourceScenePath: state`${props`currentScenePath`}.sourceScenePath`
  },
  ScenesMenuItem
)

function ScenesMenuItem({
  sceneName,
  scenePath,
  currentScenePath,
  currentSceneSourceScenePath
}) {
  const isSelected =
    scenePath === currentScenePath || scenePath === currentSceneSourceScenePath
  return (
    <div>
      <Button isSelected={isSelected}>{sceneName}</Button>
    </div>
  )
}
