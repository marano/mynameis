import { toJS } from "mobx"
import { inject } from "mobx-react"
import { get } from "lodash"

export default inject(({ state }) => {
  const tile = get(state, state.editor.selectedTilePath)
  if (!tile) {
    return
  }
  const scene = get(state, tile.scenePath)
  const worldObjects = tile.worldObjectIds.map(
    worldObjectId => scene.worldObjects[worldObjectId]
  )
  if (tile) {
    return {
      selectedTile: tile,
      tileX: tile.x,
      tileY: tile.y,
      worldObjects: toJS(worldObjects)
    }
  }
})(SelectedTileInspector)

function SelectedTileInspector(props) {
  return <div style={style()}>{content(props)}</div>
}

function content({ selectedTile, tileX, tileY, worldObjects }) {
  if (selectedTile) {
    return (
      <div>
        <div>
          {selectedTile.x}x{selectedTile.y}
        </div>
        <div>
          {worldObjects.map((worldObject, index) => (
            <p key={index}>{worldObject.entityName}</p>
          ))}
        </div>
      </div>
    )
  }
}

function style() {
  return {
    color: "white",
    fontFamily: "monospace",
    width: 100,
    minHeight: 100
  }
}
