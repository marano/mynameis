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
    currentSceneDataPath: null,
    scenes: [],
    editor: {
      currentGameMode: 'stop',
      selectedTileIndex: null
    },
    objectPicker: {
      selectedEntityIndex: null
    },
    sideMenu: {
      width: 300
    },
    definitions: {
      entities: null
    }
  },
  signals,
  modules: {}
});
