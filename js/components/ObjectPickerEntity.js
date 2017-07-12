import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import UiElement from './UiElement';

function ObjectPickerEntity({ entityIndex, uiElementsIndexes }) {
  const tileSize = 50;

  return (
    <object-picker-entity style={style()}>
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
    return {
      position: 'relative',
      display: 'inline-block',
      width: tileSize,
      height: tileSize
    };
  }
}

export default connect({
  uiElementsIndexes: state`definitions.entities.${props`entityIndex`}.uiElements.*`
}, ObjectPickerEntity);
