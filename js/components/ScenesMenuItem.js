import { props, state } from "cerebral/tags"
import Button from "./Button"

export default connect(
  {
    sceneName: state`scenes.${props`sceneId`}.name`,
    currentSceneId: state`${state`modes.${state`currentMode`}.currentScenePath`}.id`
  },
  ScenesMenuItem
)

function ScenesMenuItem({ sceneId, sceneName, currentSceneId }) {
  const isSelected = sceneId === currentSceneId
  return <Button isSelected={isSelected}>{sceneName}</Button>
}
