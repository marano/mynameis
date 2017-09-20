import { connect } from '@cerebral/inferno';
import { props, state } from 'cerebral/tags';

import WorldObject from './WorldObject';

export default connect({
  worldTile: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`
}, SceneTile);

function SceneTile({ sceneDataPath, tileIndex, worldTile, tileSize }) {
  return (
    <div style={style(worldTile, tileSize)} className="scene-tile-border-color-on-hover">
      <div style={tileContentStyle(tileSize)}>
        {
          worldTile
            .worldObjects
            .map(function (worldObject, worldObjectIndex) {
              return (
                <WorldObject
                  sceneDataPath={sceneDataPath}
                  tileIndex={tileIndex}
                  worldObjectIndex={worldObjectIndex}
                />
              );
            })
        }
      </div>
    </div>
  );
}

function style(worldTile, tileSize) {
  return {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize
  };
}

function tileContentStyle(tileSize) {
  return {
    position: 'relative', // Avoids click events to be triggered on the tile div instead of world object
    width: tileSize,
    height: tileSize
  }
}
