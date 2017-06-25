import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import WorldObject from './WorldObject';

function Viewport({ objectIndexes }) {
  return (
    <div style={style()}>
      {objectIndexes.map((objectIndex) => <WorldObject objectIndex={objectIndex} />)}
    </div>
  );

  function style() {
    return {
      position: 'relative'
    };
  }
}

export default connect({
  objectIndexes: state`world.objects.*`
}, Viewport);
