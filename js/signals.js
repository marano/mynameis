// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set, when } from 'cerebral/operators';

import {
  setEntitiesUiElements,
  initializeSceneData,
  createSceneTiles,
  fillSceneTiles,
  fillWorldObjects,
  adjustViewportSize,
  adjustViewportPositionForCameraMode,
  updateViewportVisibleTiles,
  handleKeyPress,
  changeSceneSize
} from './actions';

export default {
  entitiesLoaded: [
    setEntitiesUiElements,
    set(state`definitions.entities`, props`entities`),
  ],
  sceneTemplateLoaded: [
    initializeSceneData,
    createSceneTiles,
    fillSceneTiles,
    fillWorldObjects,
    set(state`currentSceneDataPath`, props`sceneDataPath`)
  ],
  worldObjectSelected: [
    when(state`${props`sceneDataPath`}.selectedWorldObject`),
      {
        true: set(state`${props`sceneDataPath`}.selectedWorldObject.isSelected`, false),
        false: []
      },
    // set(state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.isSelected`, true),
    set(state`${props`sceneDataPath`}.selectedWorldObject`, state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}`),
    set(state`${props`sceneDataPath`}.selectedWorldObject.isSelected`, true)
  ],
  objectPickerEntitySelected: [
    set(state`objectPicker.selectedEntityIndex`, props`entityIndex`)
  ],
  cameraModeChanged: [
    set(state`${props`sceneDataPath`}.viewport.cameraLockMode`, props`cameraLockMode`),
    adjustViewportSize,
    adjustViewportPositionForCameraMode
  ],
  sceneSizeChanged: [
    changeSceneSize,
    adjustViewportSize,
    adjustViewportPositionForCameraMode
  ],
  viewportResized: [
    set(state`${props`sceneDataPath`}.viewport.containerDimension.width`, props`viewportWidth`),
    set(state`${props`sceneDataPath`}.viewport.containerDimension.height`, props`viewportHeight`),
    adjustViewportSize
  ],
  keyPressed: handleKeyPress
};
