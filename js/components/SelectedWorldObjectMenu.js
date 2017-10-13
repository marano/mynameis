import { props, state } from 'cerebral/tags';

import { computeSelectedWorldObject } from '../computes';

export default connect({
  selectedWorldObject: computeSelectedWorldObject(state`currentSceneDataPath`)
}, SelectedWorldObjectMenu);

function SelectedWorldObjectMenu({ selectedWorldObject }) {
  return (
    <div style={style()}>
      {selectedWorldObject ? selectedWorldObject.entityName : '-'}
    </div>
  );
};

function style() {
  return {
    color: 'white',
    fontFamily: 'monospace',
    width: 100,
    height: 100
  };
}
