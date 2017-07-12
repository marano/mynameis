// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set } from 'cerebral/operators';

import {
  initializeSceneData,
  createSceneTiles,
  fillSceneTiles,
  fillWorldObjects,
  adjustViewportSize,
  updateViewportVisibleTiles,
  handleKeyPress
} from './actions';

export default {
  uiElementsLoaded: [
    set(state`definitions.uiElements`, props`uiElements`)
  ],
  entitiesLoaded: [
    set(state`definitions.entities`, props`entities`)
  ],
  sceneTemplateLoaded: [
    initializeSceneData,
    createSceneTiles,
    fillSceneTiles,
    fillWorldObjects
  ],
  viewportResized: [
    adjustViewportSize
  ],
  keyPressed: handleKeyPress
};
