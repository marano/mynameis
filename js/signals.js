// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set, debounce } from 'cerebral/operators';

import {
  createWorldTiles,
  fillWorldTiles,
  fillWorldObjects,
  adjustViewportSize,
  updateViewportVisibleTiles,
  handleKeyPress
} from './actions';

export default {
  worldLoaded: [
    createWorldTiles,
    fillWorldTiles,
    fillWorldObjects,
    set(state`world`, props`world`),
    adjustViewportSize,
    updateViewportVisibleTiles
  ],
  windowResized: [
    adjustViewportSize,
    updateViewportVisibleTiles
  ],
  keyPressed: [
    [
      handleKeyPress,
      {
        updateViewportVisibleTiles: [
          debounce(200), {
            continue: updateViewportVisibleTiles,
            discard: []
          }
        ]
      }
    ]
  ]
};
