import { get } from "lodash"
import { range } from "ramda"
import { cross } from "d3-array"

import { idOfTileAt } from "../tile-utils"

export default function createViewportActions(store) {
  return {
    viewportResized,
    viewportMoved,
    cameraModeChanged,
    modeChanged
  }

  function viewportResized(scenePath, viewportWidth, viewportHeight) {
    const { viewport } = store
    viewport.containerDimension.width = viewportWidth
    viewport.containerDimension.height = viewportHeight
    const scene = get(store, scenePath)
    adjustViewportSize(viewport, scene)
    computeVisibleTileIds(scene)
  }

  function viewportMoved(scenePath, deltaX, deltaY) {
    const scene = get(store, scenePath)
    moveViewport(scene, deltaX, deltaY)
    computeVisibleTileIds(scene)
  }

  function cameraModeChanged(scenePath, cameraLockMode) {
    const scene = get(store, scenePath)
    scene.viewport.cameraLockMode = cameraLockMode
    adjustViewportSize(store.viewport, scene)
    adjustViewportPositionForCameraMode(scene)
    computeVisibleTileIds(scene)
  }

  function modeChanged(scenePath, mode) {
    switch (mode) {
      case "game":
        // makeSceneTemplateFromScene,
        //   createScene,
        //   fillSceneFromTemplate,
        //   updateSortedTileIds,
        //   set(state`${props`scenePath`}.currentMode`, "game"),
        //   set(state`viewport.currentScenePath`, props`scenePath`),
        //   set(state`${props`scenePath`}.viewport.cameraLockMode`, "locked"),
        //   adjustViewportSize,
        //   adjustViewportPositionForCameraMode,
        //   computeVisibleTileIds()

        break
      case "editor":
        // set(
        //   state`viewport.currentScenePath`,
        //   state`${props`scenePath`}.sourceScenePath`
        // ),
        // when(props`scenePath`, state`game.selectedWorldObjectPath`, startsWith),
        // {
        //   true: set(state`game.selectedWorldObjectPath`, null),
        //   false: []
        // },
        // wait(0),
        // unset(state`${props`scenePath`}`)

        break
    }
  }
}

function adjustViewportSize(viewport, scene) {
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

  scene.viewport.size.x = viewportSize.x
  scene.viewport.size.y = viewportSize.y
}

function computeVisibleTileIds(scene) {
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

function adjustViewportPositionForCameraMode(scene) {
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
