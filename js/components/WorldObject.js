import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import UiElement from './UiElement';

function WorldObject({ tileIndex, worldObjectIndex, worldObject, tileSize }) {
  return (
    <world-object style={style()}>
      {
        worldObject
          .uiElements
          .map((uiElement, uiElementIndex) => {
            return <UiElement
                     tileIndex={tileIndex}
                     worldObjectIndex={worldObjectIndex}
                     uiElementIndex={uiElementIndex}
                   />;
          })
      }
    </world-object>
  );

  function style() {
    return {
      position: 'absolute',
      width: tileSize,
      height: tileSize
    };
  }
};

export default connect({
  worldObject: state`world.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}`,
  tileSize: state`viewport.tileSize`
}, WorldObject);
