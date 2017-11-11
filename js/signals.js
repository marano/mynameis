// import { setWorld } from './actions';
import { state, props } from "cerebral/tags"
import { debounce, set, when, equals, unset } from "cerebral/operators"

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
  updateSortedTileIds,
  addWorldObject,
  playScene,
  selectSceneTile
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
    updateSortedTileIds,
    fillWorldObjects,
    set(state`editor.currentSceneDataPath`, props`sceneDataPath`)
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
    when(state`editor.selectedTilePath`),
    {
      true: set(state`${state`editor.selectedTilePath`}.isSelected`, false),
      false: []
    },
    selectSceneTile,
    set(state`${state`editor.selectedTilePath`}.isSelected`, true)
  ],
  gameModeChanged: [
    set(state`currentGameMode`, props`gameMode`),
    equals(props`gameMode`),
    {
      play: [playScene, adjustViewportPositionForCameraMode],
      stop: [
        debounce(50),
        {
          continue: [
            unset(state`${state`game.currentSceneDataPath`}`),
            set(state`game.currentSceneDataPath`, null)
          ],
          discard: []
        }
      ]
    }
  ],
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
    updateSortedTileIds,
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
