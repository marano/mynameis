import { connect } from "@cerebral/react"
import { state, signal } from "cerebral/tags"
import { linkEvent } from "inferno"
import { css } from "emotion"

import WorldEntity from "./WorldEntity"

const className = css`
  :hover {
    border-color: white;
  }
`

export default connect(
  {
    selectedEntityName: state`editor.objectPicker.selectedEntityName`,
    objectPickerEntitySelected: signal`objectPickerEntitySelected`
  },
  ObjectPickerEntity
)

function ObjectPickerEntity(props) {
  const { entityName, selectedEntityName } = props
  const isSelected = entityName === selectedEntityName

  return (
    <div
      style={style(isSelected)}
      onClick={linkEvent(props, onClick)}
      className={className}
    >
      <WorldEntity entityName={entityName} tileSize={50} />
    </div>
  )
}

function style(isSelected) {
  const baseStyle = {
    position: "relative",
    display: "inline-block",
    borderWidth: 1,
    borderStyle: "solid",
    cursor: "pointer"
  }

  if (isSelected) {
    baseStyle.borderColor = "white"
  }

  return baseStyle
}

function onClick({ objectPickerEntitySelected, entityName }) {
  objectPickerEntitySelected({ entityName })
}
