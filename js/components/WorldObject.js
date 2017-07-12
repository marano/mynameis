import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { props, state } from 'cerebral/tags';

import UiElement from './UiElement';

function WorldObject({ sceneDataPath, tileIndex, worldObjectIndex, uiElemetsIndexes, tileSize }) {
  return (
    <world-object style={style()}>
      {
        uiElemetsIndexes
          .map((uiElementIndex) => {
            return (
              <UiElement
                uiElementDataPath={uiElementDataPath(uiElementIndex)}
                tileSize={tileSize}
              />
            );
          })
      }
    </world-object>
  );

  function uiElementDataPath(uiElementIndex) {
    return `${sceneDataPath}.tiles.${tileIndex}.worldObjects.${worldObjectIndex}.uiElements.${uiElementIndex}`;
  }

  function style() {
    return {
      position: 'absolute',
      width: tileSize,
      height: tileSize
    };
  }
};

export default connect({
  uiElemetsIndexes: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.*`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`
}, WorldObject);
