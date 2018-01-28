import { connect } from "@cerebral/react"
import { props, state } from "cerebral/tags"

export default connect(
  {
    uiElement: state`definitions.uiElements.${props`uiElementName`}`
  },
  UiElement
)

function UiElement(props) {
  return <div style={style(props)} />
}

function style({ uiElement, tileSize, currentSpriteIndex }) {
  const sprite = uiElement.sprites[currentSpriteIndex]
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
