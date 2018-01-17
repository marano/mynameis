import { Controller, Module } from "cerebral"
import Devtools from "cerebral/devtools"

import signals from "./signals"

const state = {
  scenes: {},
  viewport: {
    currentScenePath: null
  },
  editor: {
    selectedTilePath: null,
    objectPicker: {
      selectedEntityIndex: null
    }
  },
  sideMenu: {
    width: 300
  },
  definitions: {
    entities: null
  }
}

const rootModule = Module({
  state,
  signals,
  providers: {},
  modules: {},
  catch: []
})

export default Controller(rootModule, {
  devtools: Devtools({
    host: "127.0.0.1:8585",
    reconnect: false,
    storeMutations: true,
    preventExternalMutations: true
  })
})
