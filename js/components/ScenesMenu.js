import { state } from "cerebral/tags"
import ScenesMenuItem from "./ScenesMenuItem"

export default connect(
  {
    sceneIds: state`scenes.*`
  },
  ScenesMenu
)

function ScenesMenu({ sceneIds, scenePath }) {
  return (
    <div>
      {sceneIds.map(sceneId => (
        <ScenesMenuItem
          key={sceneId}
          scenePath={`scenes.${sceneId}`}
          currentScenePath={scenePath}
        />
      ))}
    </div>
  )
}
