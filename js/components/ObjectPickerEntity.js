import { connect } from 'cerebral/inferno';
import { state, props, signal } from 'cerebral/tags';

import UiElement from './UiElement';

function ObjectPickerEntity({ entityIndex, uiElementsIndexes, selectedEntityIndex, objectPickerEntitySelected }) {
  const tileSize = 50;

  return (
    <object-picker-entity style={style()} onclick={onClick} className="object-picker-entity-border-color-on-hover">
      {
        uiElementsIndexes.map(
          (uiElementIndex) => (
            <UiElement uiElementDataPath={uiElementDataPath(uiElementIndex)} tileSize={tileSize} />
          )
        )
      }
    </object-picker-entity>
  );

  function uiElementDataPath(uiElementIndex) {
    return `definitions.entities.${entityIndex}.uiElements.${uiElementIndex}`;
  }

  function style() {
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

  function onClick() {
    objectPickerEntitySelected({ entityIndex });
  }
}

export default connect({
  uiElementsIndexes: state`definitions.entities.${props`entityIndex`}.uiElements.*`,
  selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
  objectPickerEntitySelected: signal`objectPickerEntitySelected`
}, ObjectPickerEntity);
