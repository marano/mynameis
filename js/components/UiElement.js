import { toJS } from "mobx"
import { inject } from "mobx-react"
import { flow, map, join, has, find, filter, keys } from "lodash/fp"
import { get, difference, includes } from "lodash"

export default inject(({ state }, { uiElementName }) => ({
  uiElement: toJS(get(state, `definitions.uiElements.${uiElementName}`))
}))(UiElement)

function UiElement(props) {
  return <div style={style(props)} />
}

function style({
  uiElement,
  tileSize,
  currentSpriteRand,
  entityName,
  neighbourEntities
}) {
  const backgroundImage = flow(
    map(sprite => require(`../../sprites/${sprite.filename}`)),
    map(spritePath => `url(${spritePath})`),
    join(", ")
  )(
    solveSprites(
      uiElement.sprites,
      currentSpriteRand,
      entityName,
      neighbourEntities
    )
  )

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

function solveSprites(
  sprites,
  currentSpriteRand,
  entityName,
  neighbourEntities
) {
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
      const foundOnSides = flow(
        keys,
        filter(key => includes(neighbourEntities[key], entityName))
      )(neighbourEntities)
      if (
        sprite.when.same &&
        difference(sprite.when.same, foundOnSides).length === 0 &&
        difference(foundOnSides, sprite.when.same).length === 0
      ) {
        result.push(sprite)
      }
    } else {
      result.push(sprite)
    }
    return result
  }, [])
}
