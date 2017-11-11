import { state } from "cerebral/tags"
import ScenesMenuItem from "./ScenesMenuItem"

export default connect(
  {
    sceneIds: state`scenes.*`
  },
  ScenesMenu
)

function ScenesMenu({ sceneIds }) {
  return (
    <div>
      {sceneIds.map(sceneId => <ScenesMenuItem sceneId={parseInt(sceneId)} />)}
    </div>
  )
}
