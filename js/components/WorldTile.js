import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import WorldObject from './WorldObject';

function WorldTile({ tileIndex, worldTile, tileSize }) {
  return (
    <world-tile style={style()}>
      {
        worldTile
          .worldObjects
          .map((worldObject, worldObjectIndex) => {
            return <WorldObject tileIndex={tileIndex} worldObjectIndex={worldObjectIndex} />;
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
  worldTile: state`viewport.visibleTiles.${props`tileIndex`}`,
  tileSize: state`viewport.tileSize`
}, WorldTile);
