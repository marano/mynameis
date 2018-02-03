import { inject } from "mobx-react"
import { keys } from "ramda"

import ObjectPickerEntity from "./ObjectPickerEntity"

export default inject(({ state }) => ({
  entityNames: keys(state.definitions.entities)
}))(ObjectPicker)

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
