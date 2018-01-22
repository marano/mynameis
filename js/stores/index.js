import { types } from "mobx-state-tree"
import makeInspectable from "mobx-devtools-mst"

const EditorStore = types.model("Editor", {
  selectedTile: types.string
})

const initialState = {
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
  sideMenu: {
    width: 300
  },
  definitions: {
    entities: null
  }
}

export default {
  editor: makeInspectable(EditorStore.create({ selectedTile: "eee" }))
}
