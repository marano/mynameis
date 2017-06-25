import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import WorldObject from './WorldObject';

function WorldTile({ worldTile }) {
  return (
    <world-tile style={style()}>
      {worldTile.worldObjects.map((worldObject) => <WorldObject worldObject={worldObject} />)}
    </world-tile>
  );

  function style() {
    return {
      position: 'absolute',
      width: 24,
      height: 24,
      left: worldTile.x * 24,
      top: worldTile.y * 24
    };
  }
}

export default connect({
  worldTile: state`world.tiles.${props`tileIndex`}`
}, WorldTile);
