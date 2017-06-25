import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import UiElement from './UiElement';

function WorldObject({ tileIndex, worldObjectIndex, uiElemetsIndexes, tileSize }) {
  return (
    <world-object style={style()}>
      {
        uiElemetsIndexes
          .map((uiElementIndex) => {
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
  uiElemetsIndexes: state`viewport.visibleTiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.*`,
  tileSize: state`viewport.tileSize`
}, WorldObject);
