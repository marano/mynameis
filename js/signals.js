// import { setWorld } from './actions';
import { state, props } from 'cerebral/tags';
import { set } from 'cerebral/operators';

import { instantiateWorldObjects } from './actions';

export default {
  worldLoaded: [
    instantiateWorldObjects,
    set(state`world`, props`world`)
  ]
};
