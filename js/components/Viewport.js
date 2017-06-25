import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldTile from './WorldTile';

function Viewport({ tilesIndexes }) {
  return (
    <div style={style()}>
      {tilesIndexes.map((tileIndex) => <WorldTile tileIndex={tileIndex} />)}
    </div>
  );

  function style() {
    return {
      position: 'relative'
    };
  }
}

export default connect({
  tilesIndexes: state`world.tiles.*`
}, Viewport);
