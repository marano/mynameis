import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldTile from './WorldTile';

function Viewport({ tilesIndexes, tileSize, viewportSize, viewportPosition, worldSize }) {
  return (
    <div style={outerStyle()}>
      <div style={windowStyle()}>
        <div style={contentStyle()}>
          {tilesIndexes.map((tileIndex) => <WorldTile tileIndex={tileIndex} />)}
        </div>
      </div>
    </div>
  );

  function outerStyle() {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
  }

  function windowStyle() {
    return {
      position: 'relative',
      height: viewportSize.x * tileSize,
      width: viewportSize.y * tileSize
    };
  }

  function contentStyle() {
    return {
      position: 'absolute',
      height: worldSize.x * tileSize,
      width: worldSize.y * tileSize,
      left: -(viewportPosition.y * tileSize),
      top: -(viewportPosition.x * tileSize)
    };
  }
}

export default connect({
  tilesIndexes: state`viewport.visibleTiles.*`,
  tileSize: state`viewport.tileSize`,
  viewportSize: state`viewport.size`,
  viewportPosition: state`viewport.position`,
  worldSize: state`world.size`
}, Viewport);
