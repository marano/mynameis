import { computeSelectedWorldObject } from "../computes"
import { connect } from "@cerebral/react"

export default connect(
  { selectedWorldObject: computeSelectedWorldObject },
  SelectedWorldObjectMenu
)

function SelectedWorldObjectMenu({ scenePath, selectedWorldObject }) {
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
