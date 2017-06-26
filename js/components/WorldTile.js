import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import WorldObject from './WorldObject';

function WorldTile({ tileIndex, worldTile, tileSize, viewportPosition }) {
  return (
    <world-tile style={style()} data={JSON.stringify({ tile: { x: worldTile.x, y: worldTile.y } })}>
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
      left: worldTile.y * tileSize,
      top: worldTile.x * tileSize
    };
  }
}

export default connect({
  worldTile: state`viewport.visibleTiles.${props`tileIndex`}`,
  tileSize: state`viewport.tileSize`,
  viewportPosition: state`viewport.position`
}, WorldTile);
