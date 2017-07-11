import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { props, state } from 'cerebral/tags';

import UiElement from './UiElement';

function WorldObject({ viewportDataPath, sceneDataPath, tileIndex, worldObjectIndex, uiElemetsIndexes, tileSize }) {
  return (
    <world-object style={style()}>
      {
        uiElemetsIndexes
          .map((uiElementIndex) => {
            return <UiElement
                     viewportDataPath={viewportDataPath}
                     sceneDataPath={sceneDataPath}
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
  uiElemetsIndexes: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.*`,
  tileSize: state`${props`viewportDataPath`}.tileSize`
}, WorldObject);
