import { toJS } from "mobx"
import { get, cloneDeep, find, each, random, sortBy } from "lodash"
import { assign, omit, keyBy, map, mapValues, isString } from "lodash/fp"
import { compose, range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export default function createActions(store) {
  return {
    viewportResized
  }

  function viewportResized(scenePath, viewportWidth, viewportHeight) {
    store.viewport.containerDimension.width = viewportWidth
    store.viewport.containerDimension.height = viewportHeight
    adjustViewportSize(store, scenePath)
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
