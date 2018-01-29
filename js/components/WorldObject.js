import { connect } from "@cerebral/react"
import { props, state, signal } from "cerebral/tags"
import { linkEvent } from "inferno"
import { cursorExpanded, cursorOnHover } from "../styles"

import {
  computeWorldObjectSelectable,
  computeWorldObjectEntityField
} from "../computes"
import UiElement from "./UiElement"

export default connect(
  {
    uiElementNames: computeWorldObjectEntityField("uiElements"),
    zIndex: computeWorldObjectEntityField("zIndex"),
    isSelected: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.isSelected`,
    uiElementSpriteConfig: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.uiElementSpriteConfig`,
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

function onClick({ scenePath, worldObjectId, worldObjectSelected, mode }) {
  if (mode === "game") {
    worldObjectSelected({ scenePath, worldObjectId })
  }
}
