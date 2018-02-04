import { observable } from "mobx"
import { keyBy, map, mapValues } from "lodash/fp"
import { random } from "lodash"
import { compose } from "ramda"

export function createWorldObject(entity, tile, scene, state, actions) {
  const id = actions.generateId("worldObject")

  const uiElementSpriteConfig = compose(
    mapValues(({ sprites }) => ({
      rand: random(0, 1, true)
    })),
    keyBy("name"),
    map(uiElement => state.definitions.uiElements[uiElement])
  )(entity.uiElements)

  const worldObject = {
    id,
    entityName: entity.name,
    isSelected: false,
    uiElementSpriteConfig
  }

  scene.worldObjects[id] = observable(worldObject)
  tile.worldObjectIds.push(id)
}
