import { cloneDeep, find, each, sample, sortBy } from "lodash"
import { assign, omit } from "lodash/fp"
import { compose, range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

function generateId(model, state) {
  const counterPath = `idCounters.${model}`
  const id = (state.get(counterPath) || 0) + 1
  state.set(counterPath, id)
  return id
}

export function setEntitiesUiElements({
  state,
  props: { entities, uiElements }
}) {
  entities.forEach(function(entity) {
    entity.uiElements = entity.uiElements.map(name =>
      find(uiElements, { name })
    )
  })
}

export function createScene({ state }) {
  const id = generateId("scene", state)
  const scene = {
    id,
    name: `Scene ${id}`,
    currentMode: "editor",
    tiles: {},
    sortedTileIds: [],
    worldObjects: {},
    selectedWorldObjectId: null,
    size: {
      x: 0,
      y: 0
    },
    viewport: {
      tileSize: 40,
      cameraLockMode: "locked",
      visibleTileIds: [],
      size: {
        x: 0,
        y: 0
      },
      position: {
        x: 0,
        y: 0
      }
    }
  }
  const scenePath = `scenes.${scene.id}`
  state.set(scenePath, scene)
  return { scenePath }
}

export function addWorldObject({
  state,
  props: { scenePath, tileId, entityIndex }
}) {
  const entity = state.get(`definitions.entities.${entityIndex}`)
  const tile = state.get(`${scenePath}.tiles.${tileId}`)
  createWorldObject(entity, tile, scenePath, state)
}

function createSceneTileAt(scenePath, state) {
  return (x, y) => {
    createSceneTile(x, y, scenePath, state)
  }
}

function createSceneTile(x, y, scenePath, state) {
  const id = generateId("tile", state)
  const tile = {
    id,
    x,
    y,
    worldObjectIds: []
  }

  state.set(`${scenePath}.tiles.${id}`, tile)

  const selectedEntityIndex = state.get(
    `editor.objectPicker.selectedEntityIndex`
  )
  if (selectedEntityIndex) {
    const selectedEntity = state.get(
      `definitions.entities.${selectedEntityIndex}`
    )
    createWorldObject(selectedEntity, tile, scenePath, state)
  }

  return tile
}

function createWorldObject(entity, tile, scenePath, state) {
  const id = generateId("worldObject", state)
  const worldObject = {
    id,
    entityName: entity.name,
    zIndex: entity.zIndex,
    isSelected: false,
    uiElements: entity.uiElements.map(createWorldObjectUiElement)
  }

  state.set(`${scenePath}.worldObjects.${id}`, worldObject)
  state.push(`${scenePath}.tiles.${tile.id}.worldObjectIds`, id)
}

function createWorldObjectUiElement(uiElement) {
  return {
    ...uiElement,
    currentSpriteIndex: sample(range(0, uiElement.sprites.length))
  }
}

export function adjustViewportSize({ state, props: { scenePath } }) {
  const viewportContainerDimension = state.get(`viewport.containerDimension`)
  const tileSize = state.get(`${scenePath}.viewport.tileSize`)
  const sceneSize = state.get(`${scenePath}.size`)
  const cameraLockMode = state.get(`${scenePath}.viewport.cameraLockMode`)

  const maxFitSize = {
    x: Math.floor(viewportContainerDimension.width / tileSize),
    y: Math.floor(viewportContainerDimension.height / tileSize)
  }

  const viewportSizeByAxis = {
    free: function(axis) {
      return maxFitSize[axis]
    },
    locked: function(axis) {
      return Math.min(maxFitSize[axis], sceneSize[axis])
    }
  }[cameraLockMode]

  const viewportSize = {
    x: viewportSizeByAxis("x"),
    y: viewportSizeByAxis("y")
  }

  state.set(`${scenePath}.viewport.size`, viewportSize)
}

export function adjustViewportPositionForCameraMode({
  state,
  props: { scenePath }
}) {
  const currentViewportPosition = state.get(`${scenePath}.viewport.position`)
  const cameraLockMode = state.get(`${scenePath}.viewport.cameraLockMode`)
  const sceneSize = state.get(`${scenePath}.size`)
  const viewportSize = state.get(`${scenePath}.viewport.size`)

  const newAxisPosition = {
    free: function(axis) {
      return currentViewportPosition[axis]
    },
    locked: function(axis) {
      if (currentViewportPosition[axis] < 0) {
        return 0
      }
      if (
        currentViewportPosition[axis] + viewportSize[axis] >
        sceneSize[axis]
      ) {
        return sceneSize[axis] - viewportSize[axis]
      }
      return currentViewportPosition[axis]
    }
  }[cameraLockMode]

  const newPosition = {
    x: newAxisPosition("x"),
    y: newAxisPosition("y")
  }

  state.set(`${scenePath}.viewport.position`, newPosition)
}

export function moveViewport({ state, props: { deltaX, deltaY, scenePath } }) {
  const position = state.get(`${scenePath}.viewport.position`)
  const viewportSize = state.get(`${scenePath}.viewport.size`)
  const sceneSize = state.get(`${scenePath}.size`)
  const cameraLockMode = state.get(`${scenePath}.viewport.cameraLockMode`)

  const delta = {
    x: deltaX,
    y: deltaY
  }

  const positionByAxis = {
    free: function(axis) {
      return position[axis] + delta[axis]
    },
    locked: function(axis) {
      const axisCurrentPosition = position[axis]
      const axisDelta = delta[axis]
      const nextPosition = axisCurrentPosition + axisDelta
      if (axisDelta < 0 && nextPosition < 0) {
        return axisCurrentPosition
      }
      if (
        axisDelta > 0 &&
        nextPosition + viewportSize[axis] > sceneSize[axis]
      ) {
        return axisCurrentPosition
      }
      return nextPosition
    }
  }[cameraLockMode]

  const newPosition = {
    x: positionByAxis("x"),
    y: positionByAxis("y")
  }

  state.set(`${scenePath}.viewport.position`, newPosition)
}

export const keyHandlers = {
  Escape: function(state) {
    const currentScenePath = state.get("viewport.currentScenePath")
    const mode = state.get(`${currentScenePath}.currentMode`)
    if (mode === "editor") {
      state.set(`editor.objectPicker.selectedEntityIndex`, null)
    }
  }
}

export function handleKeyPress({ state, props: { key, scenePath } }) {
  const handler = keyHandlers[key]
  if (handler) {
    handler(state, scenePath)
  }
}

export function changeSceneSize({
  state,
  props: { scenePath, axis, delta, mode }
}) {
  const sceneAxisSize = state.get(`${scenePath}.size.${axis}`)
  state.set(`${scenePath}.size.${axis}`, sceneAxisSize + delta)

  if (mode === "start") {
    const currentTiles = state.get(`${scenePath}.tiles`)
    each(currentTiles, function(tile) {
      state.set(`${scenePath}.tiles.${tile.id}.${axis}`, tile[axis] + delta)
    })
  }

  if (delta > 0) {
    const sceneSize = state.get(`${scenePath}.size`)
    const deltaRange = {
      start: () => range(0, delta),
      end: () => range(sceneSize[axis] - 1, sceneSize[axis] + delta - 1)
    }[mode]()
    const otherAxisSizeRange = range(0, sceneSize[{ x: "y", y: "x" }[axis]])
    const createTileAt = createSceneTileAt(scenePath, state)
    ;({
      x: () => cross(deltaRange, otherAxisSizeRange, createTileAt),
      y: () => cross(otherAxisSizeRange, deltaRange, createTileAt)
    }[axis]())
  } else if (delta < 0) {
    const currentTiles = state.get(`${scenePath}.tiles`)
    const sceneSize = state.get(`${scenePath}.size`)
    each(currentTiles, function(tile, tileId) {
      const shouldRemove =
        tile.x < 0 ||
        tile.y < 0 ||
        tile.x >= sceneSize.x ||
        tile.y >= sceneSize.y
      if (shouldRemove) {
        state.unset(`${scenePath}.tiles.${tileId}`)
      }
    })
  }
}

export function updateSortedTileIds({ state, props: { scenePath } }) {
  const finalTiles = state.get(`${scenePath}.tiles`)
  const sortedTileIds = sortBy(finalTiles, ["x", "y"]).map(({ id }) => id)
  state.set(`${scenePath}.sortedTileIds`, sortedTileIds)
}

export function makeSceneTemplateFromScene({ state, props: { scenePath } }) {
  const scene = state.get(scenePath)
  const sceneTemplate = { ...cloneDeep(scene), sourceScenePath: scenePath }
  return { sceneTemplate }
}

export function fillSceneFromTemplate({
  props: { scenePath, sceneTemplate },
  state
}) {
  const scene = state.get(scenePath)
  state.set(
    scenePath,
    compose(
      assign(scene),
      omit(["id", "sortedTileIds", "selectedWorldObjectId"])
    )(sceneTemplate)
  )
}

export function replaceScenePathWithScenePlayPath({ props: { scenePath } }) {
  return { scenePath: `${scenePath}.play` }
}

export function selectSceneTile({ state, props: { scenePath, tileId } }) {
  state.set("editor.selectedTilePath", `${scenePath}.tiles.${tileId}`)
}

export function removeEditorScenePaths({ state, props: { scenePath } }) {
  const scenePaths = state.get("editor.scenePaths")
  const index = scenePaths.indexOf(scenePath)
  state.splice("editor.scenePaths", index, 1)
}

export function computeVisibleTileIds({ state, props: { scenePath } }) {
  const scene = state.get(scenePath)

  const animationOffset = scene.currentMode === "game" ? 2 : 0
  const minX = Math.max(0, scene.viewport.position.x - animationOffset)
  const minY = Math.max(0, scene.viewport.position.y - animationOffset)

  const maxX = Math.min(
    scene.viewport.position.x + scene.viewport.size.x + animationOffset,
    scene.size.x
  )
  const maxY = Math.min(
    scene.viewport.position.y + scene.viewport.size.y + animationOffset,
    scene.size.y
  )

  var xRange = range(minX, maxX)
  var yRange = range(minY, maxY)

  const visibleTileIds = cross(xRange, yRange, (x, y) =>
    idOfTileAt(scene.sortedTileIds, scene.size.y, x, y)
  )
  state.set(`${scenePath}.viewport.visibleTileIds`, visibleTileIds)
}
