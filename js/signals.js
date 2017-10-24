// import { setWorld } from './actions';
import { state, props } from "cerebral/tags"
import { set, when } from "cerebral/operators"

import {
  setEntitiesUiElements,
  initializeSceneData,
  createSceneTiles,
  fillSceneTiles,
  fillWorldObjects,
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  handleKeyPress,
  changeSceneSize,
  addWorldObject
} from "./actions"

export default {
  entitiesLoaded: [
    setEntitiesUiElements,
    set(state`definitions.entities`, props`entities`)
  ],
  sceneTemplateLoaded: [
    initializeSceneData,
    createSceneTiles,
    fillSceneTiles,
    fillWorldObjects,
    set(state`currentSceneDataPath`, props`sceneDataPath`)
  ],
  worldObjectSelected: [
    when(state`${props`sceneDataPath`}.selectedWorldObjectId`),
    {
      true: set(
        state`${props`sceneDataPath`}.worldObjects.${state`${props`sceneDataPath`}.selectedWorldObjectId`}.isSelected`,
        false
      ),
      false: []
    },
    set(
      state`${props`sceneDataPath`}.selectedWorldObjectId`,
      props`worldObjectId`
    ),
    set(
      state`${props`sceneDataPath`}.worldObjects.${state`${props`sceneDataPath`}.selectedWorldObjectId`}.isSelected`,
      true
    )
  ],
  objectPickerEntitySelected: [
    set(state`objectPicker.selectedEntityIndex`, props`entityIndex`)
  ],
  worldObjectAdded: [addWorldObject],
  sceneTileSelected: [
    when(state`editor.selectedTileIndex`),
    {
      true: set(
        state`${props`sceneDataPath`}.tiles.${state`editor.selectedTileIndex`}.isSelected`,
        false
      ),
      false: []
    },
    set(state`editor.selectedTileIndex`, props`tileIndex`),
    set(
      state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.isSelected`,
      true
    )
  ],
  gameModeChanged: [set(state`editor.currentGameMode`, props`gameMode`)],
  cameraModeChanged: [
    set(
      state`${props`sceneDataPath`}.viewport.cameraLockMode`,
      props`cameraLockMode`
    ),
    adjustViewportSize,
    adjustViewportPositionForCameraMode
  ],
  sceneSizeChanged: [
    changeSceneSize,
    adjustViewportSize,
    adjustViewportPositionForCameraMode
  ],
  viewportResized: [
    set(
      state`${props`sceneDataPath`}.viewport.containerDimension.width`,
      props`viewportWidth`
    ),
    set(
      state`${props`sceneDataPath`}.viewport.containerDimension.height`,
      props`viewportHeight`
    ),
    adjustViewportSize
  ],
  keyPressed: handleKeyPress
}
