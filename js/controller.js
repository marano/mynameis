import { Controller } from 'cerebral';
import Devtools from 'cerebral/devtools';

import signals from './signals';

export default Controller({
  devtools:  Devtools({
    host: '127.0.0.1:8585',
    reconnect: false,
    storeMutations: true,
    preventExternalMutations: true
  }),
  state: {
    world: {
      objects: []
    }
  },
  signals,
  modules: {}
});