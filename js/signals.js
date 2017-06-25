// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set } from 'cerebral/operators';

import {
  createWorldTiles,
  fillWorldTiles,
  fillWorldObjects
} from './actions';

export default {
  worldLoaded: [
    createWorldTiles,
    fillWorldTiles,
    fillWorldObjects,
    set(state`world`, props`world`)
  ]
};
