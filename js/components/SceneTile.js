import { props, state, signal } from "cerebral/tags"
import {
  cursor,
  cursorOnHover,
  hiddenChild,
  showHiddenChildOnHover
} from "../styles"

import WorldObject from "./WorldObject"
import WorldEntity from "./WorldEntity"

export default connect(
  {
    worldTile: state`${props`scenePath`}.tiles.${props`tileId`}`,
    tileSize: state`${props`scenePath`}.viewport.tileSize`,
    selectedEntityIndex: state`modes.editor.objectPicker.selectedEntityIndex`,
    mode: state`currentMode`,
    sceneTileSelected: signal`sceneTileSelected`,
    worldObjectAdded: signal`worldObjectAdded`
  },
  SceneTile
)

function SceneTile(props) {
  const { worldTile, scenePath } = props

  return (
    <div
      style={style(props)}
      className={`${className(props)} ${props.mode === "editor"
        ? showHiddenChildOnHover
        : null}`}
      onClick={linkEvent(props, onClick)}
    >
      <div style={tileContentStyle(props)}>
        {worldTile.worldObjectIds.map(function(worldObjectId) {
          return (
            <WorldObject
              key={worldObjectId}
              scenePath={scenePath}
              worldObjectId={worldObjectId}
            />
          )
        })}

        {renderSelectedWorldEntityOverlay(props)}
      </div>
    </div>
  )
}

function className({ mode, worldTile, selectedEntityIndex }) {
  if (mode === "editor") {
    if (worldTile.isSelected) {
      return cursor
    } else if (!selectedEntityIndex) {
      return cursorOnHover
    }
  }
}

function renderSelectedWorldEntityOverlay({ selectedEntityIndex, tileSize }) {
  if (selectedEntityIndex) {
    return (
      <div className={hiddenChild}>
        <WorldEntity entityIndex={selectedEntityIndex} tileSize={tileSize} />
      </div>
    )
  }
}

function style({ worldTile, tileSize, selectedEntityIndex, mode }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize,
    cursor: mode === "editor" && selectedEntityIndex ? "copy" : null
  }
}

function tileContentStyle({ tileSize }) {
  return {
    width: tileSize,
    height: tileSize
  }
}

function onClick({
  tileId,
  scenePath,
  sceneTileSelected,
  mode,
  selectedEntityIndex,
  worldObjectAdded
}) {
  if (mode === "editor") {
    if (selectedEntityIndex) {
      worldObjectAdded({
        scenePath,
        tileId,
        entityIndex: selectedEntityIndex
      })
    } else {
      sceneTileSelected({ tileId, scenePath })
    }
  }
}
