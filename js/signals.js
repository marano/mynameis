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
  createSceneFromEditor,
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
    updateSortedTileIds,
    fillSceneTiles,
    fillWorldObjects,
    set(state`modes.${state`currentMode`}.currentScenePath`, props`scenePath`)
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
    set(
      state`modes.editor.objectPicker.selectedEntityIndex`,
      props`entityIndex`
    )
  ],
  worldObjectAdded: [addWorldObject],
  sceneTileSelected: [
    when(state`modes.editor.selectedTilePath`),
    {
      true: set(
        state`${state`modes.editor.selectedTilePath`}.isSelected`,
        false
      ),
      false: []
    },
    selectSceneTile,
    set(state`${state`modes.editor.selectedTilePath`}.isSelected`, true)
  ],
  modeChanged: [
    set(state`currentMode`, props`mode`),
    equals(props`mode`),
    {
      game: [createSceneFromEditor, adjustViewportPositionForCameraMode],
      editor: [
        debounce(50),
        {
          continue: [
            unset(state`${state`modes.game.currentScenePath`}`),
            set(state`modes.game.currentScenePath`, null)
          ],
          discard: []
        }
      ]
    }
  ],
  cameraModeChanged: [
    set(
      state`${props`scenePath`}.viewport.cameraLockMode`,
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
      state`${props`scenePath`}.viewport.containerDimension.width`,
      props`viewportWidth`
    ),
    set(
      state`${props`scenePath`}.viewport.containerDimension.height`,
      props`viewportHeight`
    ),
    adjustViewportSize
  ],
  keyPressed: handleKeyPress
}
