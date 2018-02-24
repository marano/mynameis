import { toJS } from "mobx"
import { inject } from "mobx-react"
import { linkEvent } from "inferno"
import { cursorExpanded, cursorOnHover } from "../styles"
import get from "lodash/get"

import UiElement from "./UiElement"

export default inject(({ state, actions }, { scenePath, worldObjectId }) => {
  const scene = get(state, scenePath)
  const worldObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
  const worldObject = get(state, worldObjectPath)
  const entityPath = `definitions.entities.${worldObject.entityName}`
  const entity = get(state, entityPath)
  return {
    entityName: entity.name,
    uiElementNames: entity.uiElements.slice(),
    zIndex: entity.zIndex,
    isSelected: worldObject.isSelected,
    uiElementSpriteConfig: toJS(worldObject.uiElementSpriteConfig),
    tileSize: scene.viewport.tileSize,
    mode: scene.currentMode,
    currentGameMode: scene.currentMode,
    actions
  }
})(WorldObject)

function WorldObject(props) {
  return (
    <div
      className={className(props)}
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

function className({ currentGameMode, isSelected, worldObjectId }) {
  if (currentGameMode === "game") {
    if (isSelected) {
      return cursorExpanded
    } else {
      return cursorOnHover
    }
  }
}

function style({ zIndex, isSelected, tileSize }) {
  const style = {
    position: "absolute",
    width: tileSize,
    height: tileSize,
    zIndex: zIndex + (isSelected ? 1 : 0)
  }
  return style
}

function onClick({
  scenePath,
  worldObjectId,
  mode,
  actions: { worldObjectSelected }
}) {
  if (mode === "game") {
    worldObjectSelected(scenePath, worldObjectId)
  }
}
