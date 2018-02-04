import { inject } from "mobx-react"
import { get } from "lodash"

import ChangeSceneSizeButton from "./ChangeSceneSizeButton"

export default inject(({ state }, { scenePath }) => {
  const scene = get(state, scenePath)
  return {
    sceneSizeX: scene.size.x,
    sceneSizeY: scene.size.y
  }
})(SceneSizeEditor)

function SceneSizeEditor({ scenePath, sceneSizeX, sceneSizeY }) {
  return (
    <scene-size-editor style={style()}>
      <div style={buttonWrapperStyle(1, 4)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="y"
          delta={1}
          mode="start"
        />
      </div>
      <div style={buttonWrapperStyle(2, 4)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="y"
          delta={-1}
          mode="start"
        />
      </div>
      <div style={buttonWrapperStyle(4, 7)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="x"
          delta={1}
          mode="end"
        />
      </div>
      <div style={buttonWrapperStyle(4, 6)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="x"
          delta={-1}
          mode="end"
        />
      </div>
      <div style={buttonWrapperStyle(7, 4)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="y"
          delta={1}
          mode="end"
        />
      </div>
      <div style={buttonWrapperStyle(6, 4)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="y"
          delta={-1}
          mode="end"
        />
      </div>
      <div style={buttonWrapperStyle(4, 1)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="x"
          delta={1}
          mode="start"
        />
      </div>
      <div style={buttonWrapperStyle(4, 2)}>
        <ChangeSceneSizeButton
          scenePath={scenePath}
          axis="x"
          delta={-1}
          mode="start"
        />
      </div>
      <div style={buttonWrapperStyle(4, "3/6")}>
        <span style={{ fontSize: "12px", fontFamily: "monospace" }}>
          {sceneSizeX}x{sceneSizeY}
        </span>
      </div>
    </scene-size-editor>
  )
}

function style() {
  return {
    padding: 10,
    display: "grid",
    gridTemplateRows: "repeat(7, 20px)",
    gridTemplateColumns: "repeat(7, 20px)",
    color: "white",
    justifyContent: "center"
  }
}

function buttonWrapperStyle(row, column) {
  return {
    gridRow: row,
    gridColumn: column,
    textAlign: "center"
  }
}
