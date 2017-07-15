// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set } from 'cerebral/operators';

import {
  setEntitiesUiElements,
  initializeSceneData,
  createSceneTiles,
  fillSceneTiles,
  fillWorldObjects,
  adjustViewportSize,
  updateViewportVisibleTiles,
  handleKeyPress,
  addRowToScene
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
    fillWorldObjects
  ],
  objectPickerEntitySelected: [
    set(state`objectPicker.selectedEntityIndex`, props`entityIndex`)
  ],
  sceneRowAdded: [
    addRowToScene
  ],
  viewportResized: [
    adjustViewportSize
  ],
  keyPressed: handleKeyPress
};
