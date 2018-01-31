import { toJS } from "mobx"
import { inject } from "mobx-react"
import { flow, map, join, has, find } from "lodash/fp"
import get from "lodash/get"

export default inject(({ store }, { uiElementName }) => ({
  uiElement: toJS(get(store, `definitions.uiElements.${uiElementName}`))
}))(UiElement)

function UiElement(props) {
  return <div style={style(props)} />
}

function style({ uiElement, tileSize, currentSpriteRand }) {
  const backgroundImage = flow(
    map(sprite => require(`../../sprites/${sprite.filename}`)),
    map(spritePath => `url(${spritePath})`),
    join(", ")
  )(solveSprites(uiElement.sprites, currentSpriteRand))

  return {
    position: "absolute",
    top: 0,
    left: 0,
    imageRendering: "pixelated",
    width: tileSize,
    height: tileSize,
    zIndex: uiElement.zIndex || 0,
    backgroundRepeat: "no-repeat",
    backgroundImage,
    backgroundSize: tileSize
  }
}

function solveSprites(sprites, currentSpriteRand) {
  return sprites.reduce(function(result, sprite) {
    if (sprite.when) {
      if (has("when.rand", sprite)) {
        if (sprite.when.rand <= currentSpriteRand) {
          const otherRandSprite = find(has("when.rand"), result)
          if (otherRandSprite) {
            if (sprite.when.rand > otherRandSprite.when.rand) {
              result.splice(result.indexOf(otherRandSprite), 1)
              result.push(sprite)
            }
          } else {
            result.push(sprite)
          }
        }
      }
      if (sprite.when.same) {
        result.push(sprite)
      }
    } else {
      result.push(sprite)
    }
    return result
  }, [])
}
