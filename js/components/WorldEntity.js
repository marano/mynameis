import { inject } from "mobx-react"

import UiElement from "./UiElement"

export default inject(({ state }, { entityName }) => ({
  uiElementNames: state.definitions.entities[entityName].uiElements
}))(ObjectPickerEntity)

function ObjectPickerEntity({ entityName, uiElementNames, tileSize }) {
  return (
    <div style={style(tileSize, entityName)}>
      {uiElementNames.map(function(uiElementName) {
        return (
          <UiElement
            key={uiElementName}
            uiElementName={uiElementName}
            tileSize={tileSize}
            currentSpriteRand={0}
            neighbourEntities={{}}
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
