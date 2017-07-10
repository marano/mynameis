import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldTile from './WorldTile';

function Viewport({ tilesIndexes, tileSize, viewportSize, viewportPosition, worldSize }) {
  return (
    <viewport style={outerStyle()}>
      <viewport-window style={windowStyle()}>
        <viewport-content style={contentStyle()}>
          {tilesIndexes.map((tileIndex) => <WorldTile key={tileIndex} tileIndex={tileIndex} />)}
        </viewport-content>
      </viewport-window>
    </viewport>
  );

  function outerStyle() {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    };
  }

  function windowStyle() {
    return {
      position: 'relative',
      overflow: 'hidden',
      width: viewportSize.x * tileSize,
      height: viewportSize.y * tileSize
    };
  }

  function contentStyle() {
    return {
      position: 'absolute',
      width: worldSize.x * tileSize,
      height: worldSize.y * tileSize,
      left: -(viewportPosition.x * tileSize),
      top: -(viewportPosition.y * tileSize)
    };
  }
}

export default connect({
  tilesIndexes: state`viewport.visibleTilesIndexes`,
  tileSize: state`viewport.tileSize`,
  viewportSize: state`viewport.size`,
  viewportPosition: state`viewport.position`,
  worldSize: state`world.size`
}, Viewport);
