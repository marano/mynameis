import { inject } from "mobx-react"
import get from "lodash/get"
import { linkEvent } from "inferno"
import {
  cursor,
  cursorOnHover,
  hiddenChild,
  showHiddenChildOnHover
} from "../styles"

import WorldObject from "./WorldObject"
import WorldEntity from "./WorldEntity"

export default inject(({ state }, { scenePath, tileId }) => {
  const scene = get(state, scenePath)
  const tile = scene.tiles[tileId]
  if (!tile) {
    return {}
  }
  return {
    tileX: tile.x,
    tileY: tile.y,
    isSelected: tile.isSelected,
    objectIds: tile.worldObjectIds.slice(),
    tileSize: scene.viewport.tileSize,
    mode: scene.currentMode,
    selectedEntityName: state.editor.objectPicker.selectedEntityName,
    neighbourEntities: [],
    sceneTileSelected: () => {},
    worldObjectAdded: () => {}
  }
})(SceneTile)

function SceneTile(props) {
  if (props.tileX === undefined) {
    return null
  }
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
        {props.objectIds.map(function(worldObjectId) {
          return (
            <WorldObject
              key={worldObjectId}
              scenePath={props.scenePath}
              worldObjectId={worldObjectId}
            />
          )
        })}

        {/* {renderSelectedWorldEntityOverlay(props)} */}
      </div>
    </div>
  )
}

function className({ mode, isSelected, selectedEntityName }) {
  if (mode === "editor") {
    if (isSelected) {
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

function style({ tileX, tileY, tileSize, selectedEntityName, mode }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    left: tileX * tileSize,
    top: tileY * tileSize,
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
