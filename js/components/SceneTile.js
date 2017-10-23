import { props, state, signal } from 'cerebral/tags';
import { css } from 'emotion';
import { cursor, cursorOnHover } from '../styles'

import WorldObject from './WorldObject';
import WorldEntity from './WorldEntity';

export default connect({
  worldTile: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
  selectedEntityIndex: state`objectPicker.selectedEntityIndex`,
  sceneTileSelected: signal`sceneTileSelected`
}, SceneTile);

const selectedEntityOverlayClassName = css`
  visibility: hidden;
`;

const showSelectedEntityOverlayOnHover = css`
  :hover {
    .${selectedEntityOverlayClassName} {
      visibility: visible;
    }
  }
`

function SceneTile(props) {
  const { worldTile, sceneDataPath, tileIndex } = props
  return (
    <div
      style={style(props)}
      className={`${worldTile.isSelected ? cursor : cursorOnHover} ${showSelectedEntityOverlayOnHover}`}
      onClick={linkEvent(props, onClick)}
    >
      <div style={tileContentStyle(props)}>
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

        {renderSelectedWorldEntityOverlay(props)}
      </div>
    </div>
  );
}

function renderSelectedWorldEntityOverlay({ selectedEntityIndex, tileSize }) {
  if (selectedEntityIndex) {
    return (
      <div className={selectedEntityOverlayClassName}>
        <WorldEntity entityIndex={selectedEntityIndex} tileSize={tileSize} />
      </div>
    )
  }
}

function style({ worldTile, tileSize, selectedEntityIndex }) {
  return {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    left: worldTile.x * tileSize,
    top: worldTile.y * tileSize,
    cursor: selectedEntityIndex ? 'copy' : null
  };
}

function tileContentStyle({ tileSize }) {
  return {
    width: tileSize,
    height: tileSize
  }
}

function onClick({ tileIndex, sceneDataPath, sceneTileSelected}) {
  sceneTileSelected({ tileIndex, sceneDataPath })
}
