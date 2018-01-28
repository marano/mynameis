import { connect } from "@cerebral/react"
import { state } from "cerebral/tags"

import ObjectPickerEntity from "./ObjectPickerEntity"

export default connect(
  {
    entityNames: state`definitions.entities.*`
  },
  ObjectPicker
)

function ObjectPicker({ entityNames }) {
  return (
    <object-picker style={style()}>
      {entityNames.map(function(entityName) {
        return <ObjectPickerEntity key={entityName} entityName={entityName} />
      })}
    </object-picker>
  )
}

function style() {
  return {
    padding: 10
  }
}
