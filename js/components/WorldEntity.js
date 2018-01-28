import { connect } from "@cerebral/react"
import { state, props } from "cerebral/tags"

import UiElement from "./UiElement"

export default connect(
  {
    uiElementNames: state`definitions.entities.${props`entityName`}.uiElements`
  },
  ObjectPickerEntity
)

function ObjectPickerEntity({ entityName, uiElementNames, tileSize }) {
  return (
    <div style={style(tileSize, entityName)}>
      {uiElementNames.map(function(uiElementName) {
        return (
          <UiElement
            key={uiElementName}
            uiElementName={uiElementName}
            tileSize={tileSize}
            currentSpriteIndex={0}
          />
        )
      })}
    </div>
  )
}

function style(tileSize) {
  return {
    width: tileSize,
    height: tileSize
  }
}
