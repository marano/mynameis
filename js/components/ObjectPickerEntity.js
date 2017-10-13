import { state, props, signal } from 'cerebral/tags';

import UiElement from './UiElement';

export default connect({
  uiElementsIndexes: state`definitions.entities.${props`entityIndex`}.uiElements.*`,
  selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
  objectPickerEntitySelected: signal`objectPickerEntitySelected`
}, ObjectPickerEntity);

function ObjectPickerEntity(props) {
  const { entityIndex, uiElementsIndexes, selectedEntityIndex } = props;
  const tileSize = 50;

  return (
    <object-picker-entity
      style={style(tileSize, entityIndex, selectedEntityIndex)}
      onClick={linkEvent(props, onClick)}
      className="object-picker-entity-border-color-on-hover"
    >
      {
        uiElementsIndexes.map(function (uiElementIndex) {
          return (
            <UiElement
              key={uiElementIndex}
              uiElementDataPath={uiElementDataPath(entityIndex, uiElementIndex)}
              tileSize={tileSize}
            />
          );
        })
      }
    </object-picker-entity>
  );
}

function uiElementDataPath(entityIndex, uiElementIndex) {
  return `definitions.entities.${entityIndex}.uiElements.${uiElementIndex}`;
}

function style(tileSize, entityIndex, selectedEntityIndex) {
  const baseStyle = {
    position: 'relative',
    display: 'inline-block',
    width: tileSize,
    height: tileSize,
    borderWidth: 1,
    borderStyle: 'solid'
  };

  if (entityIndex == selectedEntityIndex) {
    baseStyle.borderColor = 'white';
  }

  return baseStyle;
}

function onClick({ objectPickerEntitySelected, entityIndex }) {
  objectPickerEntitySelected({ entityIndex });
}
