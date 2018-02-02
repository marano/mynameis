import { compose, range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "./tile-utils"

export function adjustViewportSize(viewport, scene) {
  const tileSize = scene.viewport.tileSize

  const maxFitSize = {
    x: Math.floor(viewport.containerDimension.width / tileSize),
    y: Math.floor(viewport.containerDimension.height / tileSize)
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

export function computeVisibleTileIds(scene) {
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

export function adjustViewportPositionForCameraMode(scene) {
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
