import { flow, keyBy, mapValues, isString } from "lodash/fp"

export default function createDefinitionActions(state) {
  return {
    uiElementsLoaded(data) {
      state.definitions.uiElements = flow(
        keyBy("name"),
        mapValues(({ sprites, ...uiElement }) => ({
          sprites: sprites.map(normalizeSprites),
          ...uiElement
        }))
      )(data)
    },
    entitiesLoaded(data) {
      state.definitions.entities = keyBy("name", data)
    }
  }
}

function normalizeSprites(sprite) {
  if (isString(sprite)) {
    return {
      filename: sprite
    }
  } else {
    return sprite
  }
}
