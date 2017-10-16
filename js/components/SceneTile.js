import { props, state } from 'cerebral/tags';

import WorldObject from './WorldObject';
import WorldEntity from './WorldEntity';

export default connect({
  worldTile: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
  selectedEntityIndex: state`objectPicker.selectedEntityIndex`
}, SceneTile);

function SceneTile({ sceneDataPath, tileIndex, worldTile, tileSize, selectedEntityIndex }) {
  return (
    <div style={style(worldTile, tileSize)} className="scene-tile-border-color-on-hover show-on-hover">
      <div style={tileContentStyle(tileSize)}>
        {
          worldTile
            .worldObjectIds
            .map(function (worldObjectId) {
              return (
                <WorldObject
                  key={worldObjectId}
                  sceneDataPath={sceneDataPath}
                  worldObjectId={worldObjectId}
                />
              );
            })
        }

        {renderSelectedWorldEntityOverlay(selectedEntityIndex, tileSize)}
      </div>
    </div>
  );
}

function renderSelectedWorldEntityOverlay(selectedEntityIndex, tileSize) {
  if (selectedEntityIndex) {
    return (
      <div className="show-on-hover-target">
        <WorldEntity entityIndex={selectedEntityIndex} tileSize={tileSize} />
      </div>
    )
  }
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
    width: tileSize,
    height: tileSize
  }
}
