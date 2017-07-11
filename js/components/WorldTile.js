import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { props, state } from 'cerebral/tags';

import WorldObject from './WorldObject';

function WorldTile({ viewportDataPath, sceneDataPath, tileIndex, worldTile, tileSize }) {
  return (
    <world-tile style={style()}>
      {
        worldTile
          .worldObjects
          .map((worldObject, worldObjectIndex) => {
            return (
              <WorldObject
                viewportDataPath={viewportDataPath}
                sceneDataPath={sceneDataPath}
                tileIndex={tileIndex}
                worldObjectIndex={worldObjectIndex}
              />
            );
          })
      }
    </world-tile>
  );

  function style() {
    return {
      position: 'absolute',
      width: tileSize,
      height: tileSize,
      left: worldTile.x * tileSize,
      top: worldTile.y * tileSize
    };
  }
}

export default connect({
  worldTile: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}`,
  tileSize: state`${props`viewportDataPath`}.tileSize`
}, WorldTile);
