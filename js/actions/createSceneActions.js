export default function createSceneActions(state) {
  return {
    modeChanged
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
