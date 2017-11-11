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
    worldTile: state`${props`sceneDataPath`}.tiles.${props`tileId`}`,
    tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
    selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
    gameMode: state`currentGameMode`,
    sceneTileSelected: signal`sceneTileSelected`,
    worldObjectAdded: signal`worldObjectAdded`
  },
  SceneTile
)

function SceneTile(props) {
  const { worldTile, sceneDataPath } = props

  return (
    <div
      style={style(props)}
      className={`${className(props)} ${props.gameMode === "stop"
        ? showHiddenChildOnHover
        : null}`}
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

function className({ gameMode, worldTile, selectedEntityIndex }) {
  if (gameMode === "stop") {
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

function style({ worldTile, tileSize, selectedEntityIndex, gameMode }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize,
    cursor: gameMode === "stop" && selectedEntityIndex ? "copy" : null
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
  sceneDataPath,
  sceneTileSelected,
  gameMode,
  selectedEntityIndex,
  worldObjectAdded
}) {
  if (gameMode === "stop") {
    if (selectedEntityIndex) {
      worldObjectAdded({
        sceneDataPath,
        tileId,
        entityIndex: selectedEntityIndex
      })
    } else {
      sceneTileSelected({ tileId, sceneDataPath })
    }
  }
}
