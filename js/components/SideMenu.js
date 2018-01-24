import ScenesMenu from "./ScenesMenu"
import SceneSizeEditor from "./SceneSizeEditor"
import ObjectPicker from "./ObjectPicker"
import SelectedWorldObjectMenu from "./SelectedWorldObjectMenu"
import SelectedTileInspector from "./SelectedTileInspector"

export default function SideMenu({ scenePath }) {
  return (
    <div style={style()}>
      <div style={itemStyle()}>
        <ScenesMenu scenePath={scenePath} />
      </div>
      <div style={itemStyle()}>
        <SceneSizeEditor scenePath={scenePath} />
      </div>
      <div style={itemStyle()}>
        <ObjectPicker />
      </div>
      <div style={itemStyle()}>
        <SelectedWorldObjectMenu scenePath={scenePath} />
      </div>
      <div style={itemStyle()}>
        <SelectedTileInspector />
      </div>
    </div>
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
