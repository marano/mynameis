import UiElement from "./UiElement"

// export default connect(
//   {
//     uiElementNames: state`definitions.entities.${props`entityName`}.uiElements`
//   },
//   ObjectPickerEntity
// )

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
