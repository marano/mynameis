// import { connect } from "@cerebral/react"
// import { props, state, signal } from "cerebral/tags"
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
import { computeNeighbourEntities } from "../computes"

// export default connect(
//  {
//    worldTile: state`${props`scenePath`}.tiles.${props`tileId`}`,
//    tileSize: state`${props`scenePath`}.viewport.tileSize`,
//    selectedEntityName: state`editor.objectPicker.selectedEntityName`,
//    mode: state`${props`scenePath`}.currentMode`,
//    sceneTileSelected: signal`sceneTileSelected`,
//    worldObjectAdded: signal`worldObjectAdded`,
//    neighbourEntities: computeNeighbourEntities
//  },
//  SceneTile
// )

export default inject(({ store }, { scenePath, tileId }) => ({
  tileX: get(store, `${scenePath}.tiles.${tileId}.x`),
  tileY: get(store, `${scenePath}.tiles.${tileId}.y`),
  isSelected: get(store, `${scenePath}.tiles.${tileId}.isSelected`),
  objectIds: get(store, `${scenePath}.tiles.${tileId}.worldObjectIds`).slice(),
  tileSize: get(store, `${scenePath}.viewport.tileSize`),
  mode: get(store, `${scenePath}.currentMode`),
  selectedEntityName: store.editor.objectPicker.selectedEntityName,
  neighbourEntities: []
}))(SceneTile)

function SceneTile(props) {
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
