import { inject } from "mobx-react"
import { get } from "lodash"

export default inject(({ state }) => ({
  selectedWorldObject: get(state, state.game.selectedWorldObjectPath)
}))(SelectedWorldObjectMenu)

function SelectedWorldObjectMenu({ selectedWorldObject }) {
  return (
    <div style={style()}>
      {selectedWorldObject ? selectedWorldObject.entityName : "-"}
    </div>
  )
}

function style() {
  return {
    color: "white",
    fontFamily: "monospace",
    width: 100,
    height: 100
  }
}
