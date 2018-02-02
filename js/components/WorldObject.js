import { toJS } from "mobx"
import { inject } from "mobx-react"
import { linkEvent } from "inferno"
import { cursorExpanded, cursorOnHover } from "../styles"
import get from "lodash/get"

// import {
//   computeWorldObjectSelectable,
//   computeWorldObjectEntityField
// } from "../computes"
import UiElement from "./UiElement"

// export default connect(
//   {
//     uiElementNames: computeWorldObjectEntityField("uiElements"),
//     zIndex: computeWorldObjectEntityField("zIndex"),
//     isSelected: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.isSelected`,
//     uiElementSpriteConfig: state`${props`scenePath`}.worldObjects.${props`worldObjectId`}.uiElementSpriteConfig`,
//     tileSize: state`${props`scenePath`}.viewport.tileSize`,
//     worldObjectSelectable: computeWorldObjectSelectable,
//     worldObjectSelected: signal`worldObjectSelected`,
//     mode: state`${props`scenePath`}.currentMode`
//   },
//   WorldObject
// )

export default inject(({ store }, { scenePath, worldObjectId }) => {
  const worldObjectPath = `${scenePath}.worldObjects.${worldObjectId}`
  const entityName = get(store, `${worldObjectPath}.entityName`)
  const entityPath = `definitions.entities.${entityName}`
  return {
    uiElementNames: get(store, `${entityPath}.uiElements`).slice(),
    zIndex: get(store, `${entityPath}.zIndex`),
    uiElementSpriteConfig: toJS(
      get(store, `${worldObjectPath}.uiElementSpriteConfig`)
    ),
    tileSize: get(store, `${scenePath}.viewport.tileSize`),
    mode: get(store, `${scenePath}.currentMode`),
    worldObjectSelectable: false,
    worldObjectSelected: () => {}
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

function onClick({ scenePath, worldObjectId, worldObjectSelected, mode }) {
  if (mode === "game") {
    worldObjectSelected({ scenePath, worldObjectId })
  }
}
