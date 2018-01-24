import { state, props } from "cerebral/tags"
import { set, equals, push, unset, wait, when } from "cerebral/operators"
import { isEqual } from "lodash/fp"

import {
  setEntitiesUiElements,
  createScene,
  fillSceneFromTemplate,
  createSceneTiles,
  fillSceneTiles,
  fillWorldObjects,
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  handleKeyPress,
  changeSceneSize,
  updateSortedTileIds,
  addWorldObject,
  makeSceneTemplateFromScene,
  selectSceneTile,
  moveViewport,
  removeEditorScenePaths,
  computeVisibleTileIds
} from "./actions"

export default {
  entitiesLoaded: [
    setEntitiesUiElements,
    set(state`definitions.entities`, props`entities`)
  ],
  sceneTemplateLoaded: [
    createScene,
    set(state`${props`scenePath`}.size`, props`sceneTemplate.size`),
    createSceneTiles,
    updateSortedTileIds,
    fillSceneTiles,
    fillWorldObjects,
    set(state`viewport.currentScenePath`, props`scenePath`),
    push(state`editor.scenePaths`, props`scenePath`)
  ],
  worldObjectSelected: [
    when(state`${props`scenePath`}.selectedWorldObjectId`),
    {
      true: set(
        state`${props`scenePath`}.worldObjects.${state`${props`scenePath`}.selectedWorldObjectId`}.isSelected`,
        false
      ),
      false: []
    },
    set(state`${props`scenePath`}.selectedWorldObjectId`, props`worldObjectId`),
    set(
      state`${props`scenePath`}.worldObjects.${state`${props`scenePath`}.selectedWorldObjectId`}.isSelected`,
      true
    )
  ],
  objectPickerEntitySelected: [
    set(state`editor.objectPicker.selectedEntityIndex`, props`entityIndex`)
  ],
  worldObjectAdded: [addWorldObject],
  sceneTileSelected: [
    when(state`editor.selectedTilePath`),
    {
      true: set(state`${state`editor.selectedTilePath`}.isSelected`, false),
      false: []
    },
    selectSceneTile,
    set(state`${state`editor.selectedTilePath`}.isSelected`, true)
  ],
  modeChanged: [
    equals(props`mode`),
    {
      game: [
        makeSceneTemplateFromScene,
        createScene,
        fillSceneFromTemplate,
        updateSortedTileIds,
        set(state`${props`scenePath`}.currentMode`, "game"),
        set(state`viewport.currentScenePath`, props`scenePath`),
        set(state`${props`scenePath`}.viewport.cameraLockMode`, "locked"),
        adjustViewportSize,
        adjustViewportPositionForCameraMode,
        computeVisibleTileIds
      ],
      editor: [
        set(
          state`viewport.currentScenePath`,
          state`${props`scenePath`}.sourceScenePath`
        ),
        wait(0),
        unset(state`${props`scenePath`}`)
      ]
    }
  ],
  cameraModeChanged: [
    set(
      state`${props`scenePath`}.viewport.cameraLockMode`,
      props`cameraLockMode`
    ),
    adjustViewportSize,
    adjustViewportPositionForCameraMode,
    computeVisibleTileIds
  ],
  sceneSizeChanged: [
    changeSceneSize,
    updateSortedTileIds,
    adjustViewportSize,
    adjustViewportPositionForCameraMode,
    computeVisibleTileIds
  ],
  viewportResized: [
    set(state`viewport.containerDimension.width`, props`viewportWidth`),
    set(state`viewport.containerDimension.height`, props`viewportHeight`),
    adjustViewportSize,
    computeVisibleTileIds
  ],
  keyPressed: handleKeyPress,
  viewportMoved: [moveViewport, computeVisibleTileIds],
  newSceneAdded: [
    createScene,
    set(state`viewport.currentScenePath`, props`scenePath`),
    push(state`editor.scenePaths`, props`scenePath`),
    adjustViewportSize,
    computeVisibleTileIds
  ],
  sceneChanged: [
    set(state`viewport.currentScenePath`, props`scenePath`),
    adjustViewportSize,
    computeVisibleTileIds
  ],
  sceneClosed: [
    when(props`scenePath`, state`viewport.currentScenePath`, isEqual),
    {
      true: [set(state`viewport.currentScenePath`, null)],
      false: []
    },
    removeEditorScenePaths,
    unset(state`scenePath`)
  ]
}
