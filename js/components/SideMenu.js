import { state } from "cerebral/tags"

import ScenesMenu from "./ScenesMenu"
import SceneSizeEditor from "./SceneSizeEditor"
import ObjectPicker from "./ObjectPicker"
import SelectedWorldObjectMenu from "./SelectedWorldObjectMenu"
import SelectedTileInspector from "./SelectedTileInspector"

export default connect(
  {
    width: state`sideMenu.width`
  },
  SideMenu
)

function SideMenu({ scenePath, width }) {
  return (
    <side-menu style={style()}>
      {[
        ScenesMenu,
        SceneSizeEditor,
        ObjectPicker,
        SelectedWorldObjectMenu,
        SelectedTileInspector
      ].map(Component => (
        <div style={itemStyle()}>
          <Component scenePath={scenePath} />
        </div>
      ))}
    </side-menu>
  )
}

function style() {
  return {
    display: "flex",
    flexDirection: "column"
  }
}

function itemStyle() {
  return {
    border: "2px solid white",
    margin: "10px 0",
    padding: "10px 10px"
  }
}
