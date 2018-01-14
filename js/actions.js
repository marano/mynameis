import { cloneDeep, find, range, each, sample, sortBy } from "lodash"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

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

let sceneId = 0
export function initializeSceneData({
  props: { sceneTemplate: { filling, ...sceneTemplate } },
  state
}) {
  const id = ++sceneId
  const name = `Scene ${id}`
  const tiles = {}
  const sortedTileIds = []
  const worldObjects = {}
  const selectedWorldObjectId = null
  const viewport = {
    tileSize: 40,
    cameraLockMode: "free",
    containerDimension: {
      width: null,
      height: null
    },
    size: {
      x: 0,
      y: 0
    },
    position: {
      x: 0,
      y: 0
    }
  }

  const scenePath = `scenes.${id}`
  const scene = {
    tiles,
    name,
    worldObjects,
    viewport,
    ...sceneTemplate,
    id,
    sortedTileIds,
    selectedWorldObjectId
  }

  state.set(scenePath, scene)

  return { scenePath, filling }
}

export function createSceneTiles({
  props: { scenePath, sceneTemplate: { size } },
  state
}) {
  const xRange = range(0, size.x)
  const yRange = range(0, size.y)
  cross(xRange, yRange, createSceneTileAt(scenePath, state))
}

export function fillSceneTiles({
  props: { scenePath, filling: { floor } },
  state
}) {
  const entities = state.get("definitions.entities")
  const entity = find(entities, { name: floor })
  const tiles = state.get(`${scenePath}.tiles`)
  each(tiles, tile => createWorldObject(entity, tile, scenePath, state))
}

export function fillWorldObjects({
  props: { scenePath, filling: { objects } },
  state
}) {
  const entities = state.get("definitions.entities")
  const sceneSizeY = state.get(`${scenePath}.size.y`)

  const sortedTileIds = state.get(`${scenePath}.sortedTileIds`)
  objects.forEach((object, index) => {
    const tileId = idOfTileAt(
      sortedTileIds,
      sceneSizeY,
      object.location.x,
      object.location.y
    )
    const tile = state.get(`${scenePath}.tiles.${tileId}`)
    const entity = find(entities, { name: object.entity })
    createWorldObject(entity, tile, scenePath, state)
  })
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

let tileId = 0
function createSceneTile(x, y, scenePath, state) {
  const id = ++tileId
  const tile = {
    id,
    x,
    y,
    worldObjectIds: []
  }

  state.set(`${scenePath}.tiles.${tileId}`, tile)

  const mode = state.get("currentMode")
  const selectedEntityIndex = state.get(
    `modes.${mode}.objectPicker.selectedEntityIndex`
  )
  if (selectedEntityIndex) {
    const selectedEntity = state.get(
      `definitions.entities.${selectedEntityIndex}`
    )
    createWorldObject(selectedEntity, tile, scenePath, state)
  }

  return tile
}

let worldObjectId = 0

function createWorldObject(entity, tile, scenePath, state) {
  const id = ++worldObjectId
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
  const viewportContainerDimension = state.get(
    `${scenePath}.viewport.containerDimension`
  )
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
    const mode = state.get("currentMode")
    if (mode === "editor") {
      state.set(`modes.editor.objectPicker.selectedEntityIndex`, null)
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

export function prepareSceneTemplateFromEditor({ state, props }) {
  const scenePath = state.get("modes.editor.currentScenePath")
  const scene = state.get(scenePath)
  const sceneTemplate = cloneDeep(scene)
  sceneTemplate.name = `${scene.name} (play)`
  return { sceneTemplate }
}

export function selectSceneTile({ state, props: { scenePath, tileId } }) {
  state.set("modes.editor.selectedTilePath", `${scenePath}.tiles.${tileId}`)
}
