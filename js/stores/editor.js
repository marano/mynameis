import { types } from "mobx-state-tree"

const Size = types.model("Size", {
  width: types.number,
  height: types.number
})

export default types.model("Editor", {
  selectedTile: types.maybe(types.string),
  containerDimension: types.maybe(Size)
})
