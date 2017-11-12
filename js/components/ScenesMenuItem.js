import { props, state } from "cerebral/tags"
import Button from "./Button"
import { computeCurrentSceneId } from "../computes"

export default connect(
  {
    sceneName: state`scenes.${props`sceneId`}.name`,
    currentSceneId: computeCurrentSceneId
  },
  ScenesMenuItem
)

function ScenesMenuItem({ sceneId, sceneName, currentSceneId }) {
  const isSelected = sceneId === currentSceneId
  return (
    <div>
      <Button isSelected={isSelected}>{sceneName}</Button>
    </div>
  )
}
