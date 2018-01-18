import { state } from "cerebral/tags"
import ScenesMenuItem from "./ScenesMenuItem"

export default connect(
  {
    scenePaths: state`editor.scenePaths`
  },
  ScenesMenu
)

function ScenesMenu({ scenePaths, scenePath }) {
  return (
    <div>
      {scenePaths.map(eachScenePath => (
        <ScenesMenuItem
          key={eachScenePath}
          scenePath={eachScenePath}
          currentScenePath={scenePath}
        />
      ))}
    </div>
  )
}
