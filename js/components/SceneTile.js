import { connect } from "@cerebral/react"
import { props, state, signal } from "cerebral/tags"
import { linkEvent } from "inferno"
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
    selectedEntityName: state`editor.objectPicker.selectedEntityName`,
    mode: state`${props`scenePath`}.currentMode`,
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
      className={`${className(props)} ${
        props.mode === "editor" ? showHiddenChildOnHover : null
      }`}
      onMouseDown={linkEvent(props, onMouseDown)}
      onMouseEnter={linkEvent(props, onMouseEnter)}
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

function className({ mode, worldTile, selectedEntityName }) {
  if (mode === "editor") {
    if (worldTile.isSelected) {
      return cursor
    } else if (!selectedEntityName) {
      return cursorOnHover
    }
  }
}

function renderSelectedWorldEntityOverlay({ selectedEntityName, tileSize }) {
  if (selectedEntityName) {
    return (
      <div className={hiddenChild}>
        <WorldEntity entityName={selectedEntityName} tileSize={tileSize} />
      </div>
    )
  }
}

function style({ worldTile, tileSize, selectedEntityName, mode }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize,
    cursor: mode === "editor" && selectedEntityName ? "copy" : null
  }
}

function tileContentStyle({ tileSize }) {
  return {
    width: tileSize,
    height: tileSize
  }
}

function onMouseDown(props) {
  interactWithSceneTile(props)
}

function onMouseEnter(props, { buttons }) {
  if (buttons === 1) {
    interactWithSceneTile(props)
  }
}

function interactWithSceneTile({
  tileId,
  scenePath,
  sceneTileSelected,
  mode,
  selectedEntityName,
  worldObjectAdded
}) {
  if (mode === "editor") {
    if (selectedEntityName) {
      worldObjectAdded({
        scenePath,
        tileId,
        entityName: selectedEntityName
      })
    } else {
      sceneTileSelected({ tileId, scenePath })
    }
  }
}
