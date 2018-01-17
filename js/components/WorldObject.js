import { props, state, signal } from "cerebral/tags"
import { cursorExpanded, cursorOnHover } from "../styles"

import { computeWorldObjectSelectable } from "../computes"
import UiElement from "./UiElement"

export default connect(
  {
    uiElemetsIndexes: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.uiElements.*`,
    zIndex: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.zIndex`,
    isSelected: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.isSelected`,
    tileSize: state`${props`scenePath`}.viewport.tileSize`,
    worldObjectSelectable: computeWorldObjectSelectable,
    worldObjectSelected: signal`worldObjectSelected`,
    mode: state`${props`scenePath`}.currentMode`
  },
  WorldObject
)

function WorldObject(props) {
  return (
    <div
      className={className(props)}
      style={style(props)}
      onClick={linkEvent(props, onClick)}
    >
      {props.uiElemetsIndexes.map(function(uiElementIndex) {
        return (
          <UiElement
            key={uiElementIndex}
            uiElementDataPath={uiElementDataPath(uiElementIndex, props)}
            tileSize={props.tileSize}
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

function uiElementDataPath(uiElementIndex, { scenePath, worldObjectId }) {
  return `${scenePath}.worldObjects.${worldObjectId}.uiElements.${uiElementIndex}`
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

function onClick({ scenePath, worldObjectId, worldObjectSelected, mode }) {
  if (mode === "game") {
    worldObjectSelected({ scenePath, worldObjectId })
  }
}
