import { inject } from "mobx-react"
import { linkEvent } from "inferno"

export default inject(({ actions }) => ({
  actions
}))(ChangeSceneSizeButton)

function ChangeSceneSizeButton(props) {
  return (
    <div style={style()} onClick={linkEvent(props, onClick)}>
      {props.delta > 0 ? "+" : "-"}
    </div>
  )
}

function onClick({
  scenePath,
  axis,
  delta,
  mode,
  actions: { sceneSizeChanged }
}) {
  sceneSizeChanged(scenePath, axis, delta, mode)
}

function style() {
  return {
    border: "1px solid white",
    backgroundColor: "black",
    color: "white",
    fontWeight: "bold",
    width: "100%",
    height: "100%",
    textAlign: "center",
    cursor: "pointer"
  }
}
