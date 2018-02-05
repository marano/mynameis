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
  const entityName = get(state, `${worldObjectPath}.entityName`)
  const entityPath = `definitions.entities.${entityName}`
  return {
    uiElementNames: get(state, `${entityPath}.uiElements`).slice(),
    zIndex: get(state, `${entityPath}.zIndex`),
    isSelected: worldObject.isSelected,
    uiElementSpriteConfig: toJS(
      get(state, `${worldObjectPath}.uiElementSpriteConfig`)
    ),
    tileSize: get(state, `${scenePath}.viewport.tileSize`),
    mode: get(state, `${scenePath}.currentMode`),
    worldObjectSelectable:
      scene.currentMode === "game" &&
      !state.editor.objectPicker.selectedEntityName,
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
            key={uiElementName}
            uiElementName={uiElementName}
            tileSize={props.tileSize}
            currentSpriteRand={props.uiElementSpriteConfig[uiElementName].rand}
          />
        )
      })}
    </div>
  )
}

function className({ worldObjectSelectable, isSelected, worldObjectId }) {
  if (!worldObjectSelectable) {
    return null
  } else if (isSelected) {
    return cursorExpanded
  } else {
    return cursorOnHover
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
