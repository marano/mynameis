import { toJS } from "mobx"
import { get, cloneDeep, find, each, random, sortBy } from "lodash"
import { assign, omit, keyBy, map, mapValues, isString } from "lodash/fp"
import { compose, range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export default function createActions(store) {
  return {
    viewportResized,
    viewportMoved,
    cameraModeChanged
  }

  function viewportResized(scenePath, viewportWidth, viewportHeight) {
    store.viewport.containerDimension.width = viewportWidth
    store.viewport.containerDimension.height = viewportHeight
    adjustViewportSize(store, scenePath)
    computeVisibleTileIds(store, scenePath)
  }

  function viewportMoved(scenePath, deltaX, deltaY) {
    const scene = get(store, scenePath)

    const delta = {
      x: deltaX,
      y: deltaY
    }

    const positionByAxis = {
      free: function(axis) {
        return scene.viewport.position[axis] + delta[axis]
      },
      locked: function(axis) {
        const axisCurrentPosition = scene.viewport.position[axis]
        const axisDelta = delta[axis]
        const nextPosition = axisCurrentPosition + axisDelta
        if (axisDelta < 0 && nextPosition < 0) {
          return axisCurrentPosition
        }
        if (
          axisDelta > 0 &&
          nextPosition + scene.viewport.size[axis] > scene.size[axis]
        ) {
          return axisCurrentPosition
        }
        return nextPosition
      }
    }[scene.viewport.cameraLockMode]

    const newPosition = {
      x: positionByAxis("x"),
      y: positionByAxis("y")
    }

    scene.viewport.position = newPosition
    computeVisibleTileIds(store, scenePath)
  }

  function cameraModeChanged(scenePath, cameraLockMode) {
    const scene = get(store, scenePath)
    scene.viewport.cameraLockMode = cameraLockMode
    adjustViewportSize(store, scenePath)
    adjustViewportPositionForCameraMode(store, scenePath)
    computeVisibleTileIds(store, scenePath)
  }
}

function adjustViewportSize(store, scenePath) {
  const scene = get(store, scenePath)
  const tileSize = scene.viewport.tileSize

  const maxFitSize = {
    x: Math.floor(store.viewport.containerDimension.width / tileSize),
    y: Math.floor(store.viewport.containerDimension.height / tileSize)
  }

  const viewportSizeByAxis = {
    free: function(axis) {
      return maxFitSize[axis]
    },
    locked: function(axis) {
      return Math.min(maxFitSize[axis], scene.size[axis])
    }
  }[scene.viewport.cameraLockMode]

  const viewportSize = {
    x: viewportSizeByAxis("x"),
    y: viewportSizeByAxis("y")
  }

  scene.viewport.size = viewportSize
}

export function computeVisibleTileIds(store, scenePath) {
  const scene = get(store, scenePath)

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

  scene.viewport.visibleTileIds = visibleTileIds
}

export function adjustViewportPositionForCameraMode(store, scenePath) {
  const scene = get(store, scenePath)

  const newAxisPosition = {
    free: function(axis) {
      return scene.viewport.position[axis]
    },
    locked: function(axis) {
      if (scene.viewport.position[axis] < 0) {
        return 0
      }
      if (
        scene.viewport.position[axis] + scene.viewport.size[axis] >
        scene.size[axis]
      ) {
        return scene.size[axis] - scene.viewport.size[axis]
      }
      return scene.viewport.position[axis]
    }
  }[scene.viewport.cameraLockMode]

  scene.viewport.position.x = newAxisPosition("x")
  scene.viewport.position.y = newAxisPosition("y")
}
