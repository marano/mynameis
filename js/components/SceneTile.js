import { inject } from "mobx-react"
import get from "lodash/get"
import { linkEvent } from "inferno"
import { flow, compact, join } from "lodash/fp"
import {
  cursor,
  cursorOnHover,
  hiddenChild,
  showHiddenChildOnHover
} from "../styles"

import WorldObject from "./WorldObject"
import WorldEntity from "./WorldEntity"
import UiElement from "./UiElement"

export default inject(
  ({ state, computations, actions }, { scenePath, tileId }) => {
    const scene = get(state, scenePath)
    const tile = scene.tiles[tileId]
    return {
      tileX: tile.x,
      tileY: tile.y,
      isSelected: tile.isSelected,
      objectIds: tile.worldObjectIds.slice(),
      tileSize: scene.viewport.tileSize,
      mode: scene.currentMode,
      selectedEntityName: state.editor.objectPicker.selectedEntityName,
      neighbourEntities: computations.computeTileNeighbourEntities(tile),
      casts: computations.computeTileTargetedCasts(tile),
      actions
    }
  }
)(SceneTile)

function SceneTile(props) {
  return (
    <div
      style={style(props)}
      className={flow(compact, join(" "))([
        className(props),
        props.mode === "editor" ? showHiddenChildOnHover : null
      ])}
      onMouseDown={linkEvent(props, onMouseDown)}
      onMouseEnter={linkEvent(props, onMouseEnter)}
    >
      <div style={tileContentStyle(props)}>
        {props.casts.map(function(uiElement) {
          return (
            <UiElement
              entityName={props.entityName}
              key={uiElement}
              uiElementName={uiElement}
              tileSize={props.tileSize}
              currentSpriteRand={0}
              neighbourEntities={[]}
            />
          )
        })}

        {props.objectIds.map(function(worldObjectId) {
          return (
            <WorldObject
              key={worldObjectId}
              scenePath={props.scenePath}
              worldObjectId={worldObjectId}
              neighbourEntities={props.neighbourEntities}
            />
          )
        })}

        {renderSelectedWorldEntityOverlay(props)}
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
  mode,
  selectedEntityName,
  actions: { sceneTileSelected, worldObjectAddedFromPicker }
}) {
  if (mode === "editor") {
    if (selectedEntityName) {
      worldObjectAddedFromPicker(scenePath, tileId)
    } else {
      sceneTileSelected(tileId, scenePath)
    }
  }
}
