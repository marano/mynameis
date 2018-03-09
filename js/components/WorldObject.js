import { toJS } from "mobx"
import { inject } from "mobx-react"
import { linkEvent } from "inferno"
import { cursorExpanded, cursorOnHover } from "../styles"
import { get } from "lodash"
import { flow, compact, join } from "lodash/fp"
import { css, keyframes } from "emotion"

import { movementAnimationDuration } from "../constants"

import UiElement from "./UiElement"

export default inject(({ state, actions }, { scenePath, worldObjectId }) => {
  const scene = get(state, scenePath)
  const worldObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
  const worldObject = get(state, worldObjectPath)
  const entityPath = `definitions.entities.${worldObject.entityName}`
  const entity = get(state, entityPath)
  const currentTile = scene.tiles[worldObject.tileId]
  const previousTile =
    worldObject.previousTileId && scene.tiles[worldObject.previousTileId]
  return {
    entityName: entity.name,
    uiElementNames: entity.uiElements.slice(),
    zIndex: entity.zIndex,
    isSelected: worldObject.isSelected,
    uiElementSpriteConfig: toJS(worldObject.uiElementSpriteConfig),
    tileSize: scene.viewport.tileSize,
    currentGameMode: scene.currentMode,
    shouldAnimate: !!previousTile,
    previousTileDeltaX: previousTile && previousTile.x - currentTile.x,
    previousTileDeltaY: previousTile && previousTile.y - currentTile.y,
    actions
  }
})(WorldObject)

function WorldObject(props) {
  return (
    <div
      className={flow(compact, join(" "))([
        cursorClassName(props),
        animationClassName(props)
      ])}
      style={style(props)}
      onClick={linkEvent(props, onClick)}
    >
      {props.uiElementNames.map(function(uiElementName) {
        return (
          <UiElement
            entityName={props.entityName}
            key={uiElementName}
            uiElementName={uiElementName}
            tileSize={props.tileSize}
            currentSpriteRand={props.uiElementSpriteConfig[uiElementName].rand}
            neighbourEntities={props.neighbourEntities}
          />
        )
      })}
    </div>
  )
}

function animationClassName({
  shouldAnimate,
  previousTileDeltaX,
  previousTileDeltaY,
  tileSize
}) {
  if (shouldAnimate) {
    const animation = keyframes`
      0% {
        left: ${previousTileDeltaX * tileSize}px;
        top: ${previousTileDeltaY * tileSize}px;
      }

      100% {
        left: 0;
        top: 0;
      }
    `

    return css`
      animation: ${animation} ${movementAnimationDuration}ms ease 1;
    `
  }
}

function cursorClassName({ currentGameMode, isSelected, worldObjectId }) {
  if (currentGameMode === "game") {
    if (isSelected) {
      return cursorExpanded
    } else {
      return cursorOnHover
    }
  }
}

function style({ zIndex, isSelected, tileSize }) {
  return {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    zIndex: zIndex + (isSelected ? 1 : 0)
  }
}

function onClick({
  scenePath,
  worldObjectId,
  actions: { worldObjectClicked }
}) {
  worldObjectClicked(scenePath, worldObjectId)
}
