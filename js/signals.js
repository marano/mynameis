// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set } from 'cerebral/operators';

import {
  initializeSceneData,
  createWorldTiles,
  fillWorldTiles,
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
    createWorldTiles,
    fillWorldTiles,
    fillWorldObjects
  ],
  viewportResized: [
    adjustViewportSize,
    updateViewportVisibleTiles
  ],
  keyPressed: [
    [
      handleKeyPress,
      {
        updateViewportVisibleTiles
      }
    ]
  ]
};
