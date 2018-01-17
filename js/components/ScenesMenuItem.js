import { props, state } from "cerebral/tags"
import Button from "./Button"

export default connect(
  {
    sceneName: state`${props`scenePath`}.name`
  },
  ScenesMenuItem
)

function ScenesMenuItem({ sceneName, scenePath, currentScenePath }) {
  const isSelected = currentScenePath.startsWith(scenePath)
  return (
    <div>
      <Button isSelected={isSelected}>{sceneName}</Button>
    </div>
  )
}
