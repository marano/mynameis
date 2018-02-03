import { get } from "lodash"

import * as viewportHelpers from "./viewportHelpers"

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
    viewportHelpers.adjustViewportSize(viewport, scene)
    viewportHelpers.computeVisibleTileIds(scene)
  }

  function viewportMoved(scenePath, deltaX, deltaY) {
    const scene = get(store, scenePath)
    viewportHelpers.moveViewport(scene, deltaX, deltaY)
    viewportHelpers.computeVisibleTileIds(scene)
  }

  function cameraModeChanged(scenePath, cameraLockMode) {
    const scene = get(store, scenePath)
    scene.viewport.cameraLockMode = cameraLockMode
    viewportHelpers.adjustViewportSize(store.viewport, scene)
    viewportHelpers.adjustViewportPositionForCameraMode(scene)
    viewportHelpers.computeVisibleTileIds(scene)
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
