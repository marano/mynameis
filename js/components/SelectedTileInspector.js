import { connect } from "@cerebral/inferno"
import { props } from "cerebral/tags"

import { computeSelectedTile } from "../computes"

export default connect(
  {
    selectedTile: computeSelectedTile(props`sceneDataPath`)
  },
  SelectedTileInspector
)

function SelectedTileInspector({ selectedTile }) {
  return <div style={style()}>{content(selectedTile)}</div>
}

function content(selectedTile) {
  if (selectedTile) {
    return (
      <div>
        {selectedTile.x}x{selectedTile.y}
      </div>
    )
  }
}

function style() {
  return {
    color: "white",
    fontFamily: "monospace",
    width: 100,
    height: 100
  }
}
