import { get } from "lodash"

export default function createViewportActions(state, { computeViewportSize }) {
  return {
    viewportResized(scenePath, viewportWidth, viewportHeight) {
      const { viewport } = state
      viewport.containerDimension.width = viewportWidth
      viewport.containerDimension.height = viewportHeight
    },
    viewportMoved(scenePath, deltaX, deltaY) {
      const scene = get(state, scenePath)
      moveViewport(scene, deltaX, deltaY)
    },
    cameraModeChanged(scenePath, cameraLockMode) {
      const scene = get(state, scenePath)
      scene.viewport.cameraLockMode = cameraLockMode
      const viewportSize = computeViewportSize(state.viewport)
      adjustViewportPositionForCameraMode(scene, viewportSize)
    }
  }
}

function adjustViewportPositionForCameraMode(scene, viewportSize) {
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

function moveViewport(scene, deltaX, deltaY) {
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

  scene.viewport.position.x = newPosition.x
  scene.viewport.position.y = newPosition.y
}
