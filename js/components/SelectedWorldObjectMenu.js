import { props } from "cerebral/tags"

import { computeSelectedWorldObject } from "../computes"

export default connect(
  {
    selectedWorldObject: computeSelectedWorldObject(props`scenePath`)
  },
  SelectedWorldObjectMenu
)

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
