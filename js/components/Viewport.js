import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldTile from './WorldTile';

function Viewport({ tilesIndexes, tileSize, viewportSize }) {
  return (
    <div style={wrapperStyle()}>
      <div style={innerStyle()}>
        {tilesIndexes.map((tileIndex) => <WorldTile tileIndex={tileIndex} />)}
      </div>
    </div>
  );

  function wrapperStyle() {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
  }

  function innerStyle() {
    return {
      position: 'relative',
      height: viewportSize.x * tileSize,
      width: viewportSize.y * tileSize
    };
  }
}

export default connect({
  tilesIndexes: state`viewport.visibleTiles.*`,
  tileSize: state`viewport.tileSize`,
  viewportSize: state`viewport.size`
}, Viewport);
