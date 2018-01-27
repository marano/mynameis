import { Controller, Module } from "cerebral"
import Devtools from "cerebral/devtools"

import signals from "./signals"

export const initialState = {
  idCounters: {},
  scenes: {},
  viewport: {
    currentScenePath: null,
    containerDimension: {
      width: null,
      height: null
    }
  },
  editor: {
    selectedTilePath: null,
    objectPicker: {
      selectedEntityIndex: null
    },
    scenePaths: []
  },
  game: {
    selectedWorldObjectPath: null
  },
  definitions: {
    entities: null
  }
}

export default function createController(state) {
  const rootModule = Module({
    state,
    signals,
    providers: {},
    modules: {},
    catch: []
  })

  return Controller(rootModule, {
    devtools: Devtools({
      host: "127.0.0.1:8585",
      reconnect: false,
      storeMutations: true,
      preventExternalMutations: true
    })
  })
}
