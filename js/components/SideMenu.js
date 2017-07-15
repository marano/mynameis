import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import SceneSizeEditor from './SceneSizeEditor';
import ObjectPicker from './ObjectPicker';

export default connect({
  width: state`sideMenu.width`
}, SideMenu);

function SideMenu({ width }) {
  return (
    <side-menu style={style()}>
      <SceneSizeEditor />
      <ObjectPicker />
    </side-menu>
  );
};

function style() {
  return {
    display: 'flex',
    flexDirection: 'column'
  };
}
