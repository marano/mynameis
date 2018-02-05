import { range } from "ramda"
import { cross } from "d3-array"
import { get, curry } from "lodash"

import { idOfTileAt } from "../tile-utils"

export default function createViewportComputations(state, computations) {
  return {
    computeViewportSize(viewport) {
      const scene = get(state, viewport.currentScenePath)

      const maxFitSize = {
        x: Math.floor(
          viewport.containerDimension.width / scene.viewport.tileSize
        ),
        y: Math.floor(
          viewport.containerDimension.height / scene.viewport.tileSize
        )
      }

      const viewportSizeByAxis = {
        free: function(axis) {
          return maxFitSize[axis]
        },
        locked: function(axis) {
          return Math.min(maxFitSize[axis], scene.size[axis])
        }
      }[scene.viewport.cameraLockMode]

      return {
        x: viewportSizeByAxis("x"),
        y: viewportSizeByAxis("y")
      }
    },
    computeVisibleTileIds(viewport) {
      const viewportSize = computations.computeViewportSize(viewport)
      const scene = get(state, viewport.currentScenePath)

      const animationOffset = scene.currentMode === "game" ? 2 : 0
      const minX = Math.max(0, scene.viewport.position.x - animationOffset)
      const minY = Math.max(0, scene.viewport.position.y - animationOffset)

      const maxX = Math.min(
        scene.viewport.position.x + viewportSize.x + animationOffset,
        scene.size.x
      )
      const maxY = Math.min(
        scene.viewport.position.y + viewportSize.y + animationOffset,
        scene.size.y
      )

      var xRange = range(minX, maxX)
      var yRange = range(minY, maxY)

      const sortedTileIds = computations.computeSortedTileIds(scene)

      return cross(
        xRange,
        yRange,
        curry(idOfTileAt)(sortedTileIds, scene.size.y)
      )
    }
  }
}
