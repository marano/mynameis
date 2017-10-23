import { props, state } from "cerebral/tags"

export default connect(
  {
    uiElement: state`${props`uiElementDataPath`}`
  },
  UiElement
)

function UiElement({ uiElement, tileSize }) {
  return <ui-element style={style(uiElement, tileSize)} />
}

function style(uiElement, tileSize) {
  const sprite = uiElement.sprites[uiElement.currentSpriteIndex || 0]
  const spritePath = require(`../../sprites/${sprite}`)

  return {
    position: "absolute",
    top: 0,
    left: 0,
    imageRendering: "pixelated",
    width: tileSize,
    height: tileSize,
    zIndex: uiElement.zIndex || 0,
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${spritePath})`,
    backgroundSize: tileSize
  }
}
