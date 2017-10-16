import { state, props, signal } from 'cerebral/tags';

import WorldEntity from './WorldEntity';

export default connect({
  selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
  objectPickerEntitySelected: signal`objectPickerEntitySelected`
}, ObjectPickerEntity);

function ObjectPickerEntity(props) {
  const { entityIndex, selectedEntityIndex } = props;

  return (
    <div
      style={style(entityIndex, selectedEntityIndex)}
      onClick={linkEvent(props, onClick)}
      className="object-picker-entity-border-color-on-hover"
    >
      <WorldEntity entityIndex={entityIndex} tileSize={50} />
    </div>
  );
}

function uiElementDataPath(entityIndex, uiElementIndex) {
  return `definitions.entities.${entityIndex}.uiElements.${uiElementIndex}`;
}

function style(entityIndex, selectedEntityIndex) {
  const baseStyle = {
    position: 'relative',
    display: 'inline-block',
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer'
  };

  if (entityIndex == selectedEntityIndex) {
    baseStyle.borderColor = 'white';
  }

  return baseStyle;
}

function onClick({ objectPickerEntitySelected, entityIndex }) {
  objectPickerEntitySelected({ entityIndex });
}
