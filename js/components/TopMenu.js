import GameModeSwitch from "./GameModeSwitch"
import CameraLockModeSwitch from "./CameraLockModeSwitch"

export default function TopMenu({ viewport }) {
  return (
    <div style={style()}>
      {[GameModeSwitch, CameraLockModeSwitch].map((Component, index) => (
        <div key={index} style={itemStyle()}>
          <Component viewport={viewport} />
        </div>
      ))}
    </div>
  )
}

function style() {
  return {
    display: "flex",
    flexDirection: "row"
  }
}

function itemStyle() {
  return {
    margin: "15px 15px 0 5px"
  }
}
