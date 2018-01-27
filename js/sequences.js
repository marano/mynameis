import { state, props, string } from "cerebral/tags"
import { set, equals, push, unset, wait, when } from "cerebral/operators"
import { isEqual } from "lodash/fp"

import {
  setEntitiesUiElements,
  createScene,
  fillSceneFromTemplate,
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  handleKeyPress as handleKeyPressAction,
  changeSceneSize as changeSceneSizeAction,
  updateSortedTileIds,
  addWorldObject as addWorldObjectAction,
  makeSceneTemplateFromScene,
  selectSceneTile as selectSceneTileAction,
  moveViewport as moveViewportAction,
  removeEditorScenePaths,
  computeVisibleTileIds
} from "./actions"

export const loadEntities = [
  setEntitiesUiElements,
  set(state`definitions.entities`, props`entities`)
]

export const selectWorldObject = [
  when(state`game.selectedWorldObjectPath`),
  {
    true: set(state`${state`game.selectedWorldObjectPath`}.isSelected`, false),
    false: []
  },
  set(
    state`game.selectedWorldObjectPath`,
    string`${props`scenePath`}.worldObjects.${props`worldObjectId`}`
  ),
  set(state`${state`game.selectedWorldObjectPath`}.isSelected`, true)
]

export const selectObjectPickerEntity = set(
  state`editor.objectPicker.selectedEntityIndex`,
  props`entityIndex`
)

export const addWorldObject = addWorldObjectAction

export const selectSceneTile = [
  when(state`editor.selectedTilePath`),
  {
    true: set(state`${state`editor.selectedTilePath`}.isSelected`, false),
    false: []
  },
  selectSceneTileAction,
  set(state`${state`editor.selectedTilePath`}.isSelected`, true)
]

export const changeMode = [
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
]

export const changeCameraMode = [
  set(
    state`${props`scenePath`}.viewport.cameraLockMode`,
    props`cameraLockMode`
  ),
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  computeVisibleTileIds
]

export const changeSceneSize = [
  changeSceneSizeAction,
  updateSortedTileIds,
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  computeVisibleTileIds
]

export const resizeViewport = [
  set(state`viewport.containerDimension.width`, props`viewportWidth`),
  set(state`viewport.containerDimension.height`, props`viewportHeight`),
  adjustViewportSize,
  computeVisibleTileIds
]

export const handleKeyPress = handleKeyPressAction

export const moveViewport = [moveViewportAction, computeVisibleTileIds]

export const addNewScene = [
  createScene,
  set(state`viewport.currentScenePath`, props`scenePath`),
  push(state`editor.scenePaths`, props`scenePath`),
  adjustViewportSize,
  computeVisibleTileIds
]

export const changeScene = [
  set(state`viewport.currentScenePath`, props`scenePath`),
  adjustViewportSize,
  computeVisibleTileIds
]

export const closeScene = [
  when(props`scenePath`, state`viewport.currentScenePath`, isEqual),
  {
    true: [set(state`viewport.currentScenePath`, null)],
    false: []
  },
  removeEditorScenePaths,
  unset(state`${props`scenePath`}`)
]
