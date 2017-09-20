import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

export default connect({
  selectedWorldObject: state`${state`currentSceneDataPath`}.selectedWorldObject`
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
