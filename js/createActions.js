import { get } from "lodash"

import * as actionHelpers from "./actionHelpers"

export default function createActions(store) {
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
    actionHelpers.adjustViewportSize(viewport, scene)
    actionHelpers.computeVisibleTileIds(scene)
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

    scene.viewport.position.x = newPosition.x
    scene.viewport.position.y = newPosition.y

    actionHelpers.computeVisibleTileIds(scene)
  }

  function cameraModeChanged(scenePath, cameraLockMode) {
    const scene = get(store, scenePath)
    scene.viewport.cameraLockMode = cameraLockMode
    actionHelpers.adjustViewportSize(store.viewport, scene)
    actionHelpers.adjustViewportPositionForCameraMode(scene)
    actionHelpers.computeVisibleTileIds(scene)
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
