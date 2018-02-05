import { inject } from "mobx-react"
import { get } from "lodash"

export default inject(({ state }) => ({
  selectedTile: get(state, state.editor.selectedTilePath)
}))(SelectedTileInspector)

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
