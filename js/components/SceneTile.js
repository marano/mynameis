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
    worldTile: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}`,
    tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
    selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
    sceneTileSelected: signal`sceneTileSelected`,
    gameMode: state`editor.currentGameMode`
  },
  SceneTile
)

function SceneTile(props) {
  const { worldTile, sceneDataPath } = props
  return (
    <div
      style={style(props)}
      className={`${className(props)} ${showHiddenChildOnHover}`}
      onClick={linkEvent(props, onClick)}
    >
      <div style={tileContentStyle(props)}>
        {worldTile.worldObjectIds.map(function(worldObjectId) {
          return (
            <WorldObject
              key={worldObjectId}
              sceneDataPath={sceneDataPath}
              worldObjectId={worldObjectId}
            />
          )
        })}

        {renderSelectedWorldEntityOverlay(props)}
      </div>
    </div>
  )
}

function className({ gameMode, worldTile }) {
  if (gameMode === "play") {
    return null
  } else if (gameMode === "stop") {
    if (worldTile.isSelected) {
      return cursor
    } else {
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

function style({ worldTile, tileSize, selectedEntityIndex }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize,
    cursor: selectedEntityIndex ? "copy" : null
  }
}

function tileContentStyle({ tileSize }) {
  return {
    width: tileSize,
    height: tileSize
  }
}

function onClick({ tileIndex, sceneDataPath, sceneTileSelected, gameMode }) {
  if (gameMode === "stop") {
    sceneTileSelected({ tileIndex, sceneDataPath })
  }
}
