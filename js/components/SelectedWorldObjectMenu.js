import { computeSelectedWorldObject } from "../computes"
import { branch, compose, renderNothing } from "incompose"

export default compose(
  branch(({ scenePath }) => !scenePath, renderNothing),
  connect({ selectedWorldObject: computeSelectedWorldObject })
)(SelectedWorldObjectMenu)

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
