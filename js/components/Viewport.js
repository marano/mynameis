import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldTile from './WorldTile';

function Viewport({ tilesIndexes, tileSize, worldDimension }) {
  return (
    <div style={wrapperStyle()}>
      <div style={containerStyle()}>
        {tilesIndexes.map((tileIndex) => <WorldTile tileIndex={tileIndex} />)}
      </div>
    </div>
  );

  function wrapperStyle() {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    };
  }

  function containerStyle() {
    return {
      position: 'relative',
      width: worldDimension.width * tileSize,
      height: worldDimension.height * tileSize
    };
  }
}

export default connect({
  tilesIndexes: state`world.tiles.*`,
  tileSize: state`viewport.tileSize`,
  worldDimension: state`world.dimension`
}, Viewport);
