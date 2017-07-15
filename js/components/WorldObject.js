import { connect } from 'cerebral/inferno';
import { props, state } from 'cerebral/tags';

import UiElement from './UiElement';

export default connect({
  uiElemetsIndexes: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.*`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`
}, WorldObject);

function WorldObject({ sceneDataPath, tileIndex, worldObjectIndex, uiElemetsIndexes, tileSize }) {
  return (
    <world-object style={style(tileSize)}>
      {
        uiElemetsIndexes
          .map((uiElementIndex) => {
            return (
              <UiElement
                uiElementDataPath={uiElementDataPath(sceneDataPath, tileIndex, worldObjectIndex, uiElementIndex)}
                tileSize={tileSize}
              />
            );
          })
      }
    </world-object>
  );
};

function uiElementDataPath(sceneDataPath, tileIndex, worldObjectIndex, uiElementIndex) {
  return `${sceneDataPath}.tiles.${tileIndex}.worldObjects.${worldObjectIndex}.uiElements.${uiElementIndex}`;
}

function style(tileSize) {
  return {
    position: 'absolute',
    width: tileSize,
    height: tileSize
  };
}
