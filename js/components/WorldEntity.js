import { connect } from "@cerebral/react"
import { state, props } from "cerebral/tags"

import UiElement from "./UiElement"

export default connect(
  {
    uiElementsIndexes: state`definitions.entities.${props`entityIndex`}.uiElements.*`
  },
  ObjectPickerEntity
)

function ObjectPickerEntity({ entityIndex, uiElementsIndexes, tileSize }) {
  return (
    <div style={style(tileSize, entityIndex)}>
      {uiElementsIndexes.map(function(uiElementIndex) {
        return (
          <UiElement
            key={uiElementIndex}
            uiElementDataPath={uiElementDataPath(entityIndex, uiElementIndex)}
            tileSize={tileSize}
          />
        )
      })}
    </div>
  )
}

function uiElementDataPath(entityIndex, uiElementIndex) {
  return `definitions.entities.${entityIndex}.uiElements.${uiElementIndex}`
}

function style(tileSize, entityIndex) {
  return {
    width: tileSize,
    height: tileSize
  }
}
