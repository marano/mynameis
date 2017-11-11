import { cloneDeep, find, range, each, sample, sortBy, throttle } from "lodash"
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
  props: { sceneTemplate: { size } },
  state
}) {
  const id = ++sceneId
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

  const sceneDataPath = `scenes.${id}`

  state.set(sceneDataPath, {
    id,
    tiles,
    sortedTileIds,
    worldObjects,
    size,
    selectedWorldObjectId,
    viewport
  })

  return { sceneDataPath }
}

export function createSceneTiles({
  props: { sceneDataPath, sceneTemplate: { size } },
  state
}) {
  const xRange = range(0, size.x)
  const yRange = range(0, size.y)
  cross(xRange, yRange, createSceneTileAt(sceneDataPath, state))
}

export function fillSceneTiles({
  props: { sceneDataPath, sceneTemplate: { filling: { floor } } },
  state
}) {
  const entities = state.get("definitions.entities")
  const entity = find(entities, { name: floor })
  const tiles = state.get(`${sceneDataPath}.tiles`)
  each(tiles, tile => createWorldObject(entity, tile, sceneDataPath, state))
}

export function fillWorldObjects({
  props: { sceneDataPath, sceneTemplate: { filling: { objects } } },
  state
}) {
  const entities = state.get("definitions.entities")
  const sceneSizeY = state.get(`${sceneDataPath}.size.y`)

  const sortedTileIds = state.get(`${sceneDataPath}.sortedTileIds`)
  objects.forEach((object, index) => {
    let tileId = idOfTileAt(
      sortedTileIds,
      sceneSizeY,
      object.location.x,
      object.location.y
    )
    const tile = state.get(`${sceneDataPath}.tiles.${tileId}`)
    const entity = find(entities, { name: object.entity })
    createWorldObject(entity, tile, sceneDataPath, state)
  })
}

export function addWorldObject({
  state,
  props: { sceneDataPath, tileId, entityIndex }
}) {
  const entity = state.get(`definitions.entities.${entityIndex}`)
  const tile = state.get(`${sceneDataPath}.tiles.${tileId}`)
  createWorldObject(entity, tile, sceneDataPath, state)
}

function createSceneTileAt(sceneDataPath, state) {
  return (x, y) => {
    createSceneTile(x, y, sceneDataPath, state)
  }
}

let tileId = 0
function createSceneTile(x, y, sceneDataPath, state) {
  const id = ++tileId
  const tile = {
    id,
    x,
    y,
    worldObjectIds: []
  }

  state.set(`${sceneDataPath}.tiles.${tileId}`, tile)

  const selectedEntityIndex = state.get("objectPicker.selectedEntityIndex")
  if (selectedEntityIndex) {
    const selectedEntity = state.get(
      `definitions.entities.${selectedEntityIndex}`
    )
    createWorldObject(selectedEntity, tile, sceneDataPath, state)
  }

  return tile
}

let worldObjectId = 0

function createWorldObject(entity, tile, sceneDataPath, state) {
  const id = ++worldObjectId
  const worldObject = {
    id,
    entityName: entity.name,
    zIndex: entity.zIndex,
    isSelected: false,
    uiElements: entity.uiElements.map(createWorldObjectUiElement)
  }

  state.set(`${sceneDataPath}.worldObjects.${id}`, worldObject)
  state.push(`${sceneDataPath}.tiles.${tile.id}.worldObjectIds`, id)
}

function createWorldObjectUiElement(uiElement) {
  return {
    ...uiElement,
    currentSpriteIndex: sample(range(0, uiElement.sprites.length))
  }
}

export function adjustViewportSize({ state, props: { sceneDataPath } }) {
  const viewportContainerDimension = state.get(
    `${sceneDataPath}.viewport.containerDimension`
  )
  const tileSize = state.get(`${sceneDataPath}.viewport.tileSize`)
  const sceneSize = state.get(`${sceneDataPath}.size`)
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`)

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

  state.set(`${sceneDataPath}.viewport.size`, viewportSize)
}

export function adjustViewportPositionForCameraMode({
  state,
  props: { sceneDataPath }
}) {
  const currentViewportPosition = state.get(
    `${sceneDataPath}.viewport.position`
  )
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`)
  const sceneSize = state.get(`${sceneDataPath}.size`)
  const viewportSize = state.get(`${sceneDataPath}.viewport.size`)

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

  state.set(`${sceneDataPath}.viewport.position`, newPosition)
}

function panViewportPosition(deltaX, deltaY, state, sceneDataPath) {
  const position = state.get(`${sceneDataPath}.viewport.position`)
  const viewportSize = state.get(`${sceneDataPath}.viewport.size`)
  const sceneSize = state.get(`${sceneDataPath}.size`)
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`)

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

  state.set(`${sceneDataPath}.viewport.position`, newPosition)
}

const keyHandler = {
  w: function(state, sceneDataPath) {
    panViewportPosition(0, -1, state, sceneDataPath)
  },
  s: function(state, sceneDataPath) {
    panViewportPosition(0, +1, state, sceneDataPath)
  },
  a: function(state, sceneDataPath) {
    panViewportPosition(-1, 0, state, sceneDataPath)
  },
  d: function(state, sceneDataPath) {
    panViewportPosition(+1, 0, state, sceneDataPath)
  },
  escape: function(state) {
    state.set("objectPicker.selectedEntityIndex", null)
  }
}

export const handleKeyPress = throttle(function({
  state,
  props: { key, sceneDataPath }
}) {
  const handler = keyHandler[key]
  if (handler) {
    handler(state, sceneDataPath)
  }
},
120)

export function changeSceneSize({
  state,
  props: { sceneDataPath, axis, delta, mode }
}) {
  const sceneAxisSize = state.get(`${sceneDataPath}.size.${axis}`)
  state.set(`${sceneDataPath}.size.${axis}`, sceneAxisSize + delta)

  if (mode === "start") {
    const currentTiles = state.get(`${sceneDataPath}.tiles`)
    each(currentTiles, function(tile) {
      state.set(`${sceneDataPath}.tiles.${tile.id}.${axis}`, tile[axis] + delta)
    })
  }

  if (delta > 0) {
    const sceneSize = state.get(`${sceneDataPath}.size`)
    const deltaRange = {
      start: () => range(0, delta),
      end: () => range(sceneSize[axis] - 1, sceneSize[axis] + delta - 1)
    }[mode]()
    const otherAxisSizeRange = range(0, sceneSize[{ x: "y", y: "x" }[axis]])
    const createTileAt = createSceneTileAt(sceneDataPath, state)
    ;({
      x: () => cross(deltaRange, otherAxisSizeRange, createTileAt),
      y: () => cross(otherAxisSizeRange, deltaRange, createTileAt)
    }[axis]())
  } else if (delta < 0) {
    const currentTiles = state.get(`${sceneDataPath}.tiles`)
    const sceneSize = state.get(`${sceneDataPath}.size`)
    each(currentTiles, function(tile, tileId) {
      const shouldRemove =
        tile.x < 0 ||
        tile.y < 0 ||
        tile.x >= sceneSize.x ||
        tile.y >= sceneSize.y
      if (shouldRemove) {
        state.unset(`${sceneDataPath}.tiles.${tileId}`)
      }
    })
  }
}

export function updateSortedTileIds({ state, props: { sceneDataPath } }) {
  const finalTiles = state.get(`${sceneDataPath}.tiles`)
  const sortedTileIds = sortBy(finalTiles, ["x", "y"]).map(({ id }) => id)
  state.set(`${sceneDataPath}.sortedTileIds`, sortedTileIds)
}

export function playScene({ state, props }) {
  const editorSceneDataPath = state.get("editor.currentSceneDataPath")
  const scene = state.get(editorSceneDataPath)
  const id = ++sceneId
  const newScene = { ...cloneDeep(scene), id }
  const sceneDataPath = `scenes.${id}`
  state.set(sceneDataPath, newScene)
  state.set("game.currentSceneDataPath", sceneDataPath)
  state.set(`${sceneDataPath}.viewport.cameraLockMode`, "locked")
  return { sceneDataPath }
}

export function selectSceneTile({ state, props: { sceneDataPath, tileId } }) {
  state.set("editor.selectedTilePath", `${sceneDataPath}.tiles.${tileId}`)
}
