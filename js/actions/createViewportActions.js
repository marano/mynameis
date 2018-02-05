import { get } from "lodash"

import { adjustViewportPositionForCameraMode } from "./helpers"

export default function createViewportActions(state, computations) {
  return {
    viewportResized(viewport, viewportWidth, viewportHeight) {
      viewport.containerDimension.width = viewportWidth
      viewport.containerDimension.height = viewportHeight
    },
    viewportMoved(viewport, deltaX, deltaY) {
      const viewportSize = computations.computeViewportSize(viewport)
      const scene = get(state, viewport.currentScenePath)
      moveViewport(viewport, viewportSize, scene, deltaX, deltaY)
    },
    cameraModeChanged(viewport, cameraLockMode) {
      const scene = get(state, viewport.currentScenePath)
      scene.viewport.cameraLockMode = cameraLockMode
      adjustViewportPositionForCameraMode(viewport, state, computations)
    }
  }
}

function moveViewport(viewport, viewportSize, scene, deltaX, deltaY) {
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
        nextPosition + viewportSize[axis] > scene.size[axis]
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

  scene.viewport.position.x = newPosition.x
  scene.viewport.position.y = newPosition.y
}
