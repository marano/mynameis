import { observable } from "mobx"
import { keyBy, map, mapValues } from "lodash/fp"
import { get, random } from "lodash"
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
    sceneId: scene.id,
    tileId: tile.id,
    id,
    entityName: entity.name,
    isSelected: false,
    uiElementSpriteConfig
  }

  scene.worldObjects[id] = observable(worldObject)
  tile.worldObjectIds.push(id)
}

export function adjustViewportPositionForCameraMode(
  viewport,
  state,
  computations
) {
  const scene = get(state, viewport.currentScenePath)
  const viewportSize = computations.computeViewportSize(viewport)

  const newAxisPosition = {
    free: function(axis) {
      return scene.viewport.position[axis]
    },
    locked: function(axis) {
      if (scene.viewport.position[axis] < 0) {
        return 0
      }
      if (
        scene.viewport.position[axis] + viewportSize[axis] >
        scene.size[axis]
      ) {
        return scene.size[axis] - viewportSize[axis]
      }
      return scene.viewport.position[axis]
    }
  }[scene.viewport.cameraLockMode]

  scene.viewport.position.x = newAxisPosition("x")
  scene.viewport.position.y = newAxisPosition("y")
}
