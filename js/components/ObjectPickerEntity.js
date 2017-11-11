import { state, signal } from "cerebral/tags"
import { css } from "emotion"

import WorldEntity from "./WorldEntity"

const className = css`
  :hover {
    border-color: white;
  }
`

export default connect(
  {
    selectedEntityIndex: state`modes.editor.objectPicker.selectedEntityIndex`,
    objectPickerEntitySelected: signal`objectPickerEntitySelected`
  },
  ObjectPickerEntity
)

function ObjectPickerEntity(props) {
  const { entityIndex, selectedEntityIndex } = props
  const isSelected = entityIndex === selectedEntityIndex

  return (
    <div
      style={style(isSelected)}
      onClick={linkEvent(props, onClick)}
      className={className}
    >
      <WorldEntity entityIndex={entityIndex} tileSize={50} />
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

function onClick({ objectPickerEntitySelected, entityIndex }) {
  objectPickerEntitySelected({ entityIndex })
}
