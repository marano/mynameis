import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import SceneMenu from './SceneMenu';
import ObjectPicker from './ObjectPicker';

function SideMenu({ width }) {
  return (
    <side-menu style={style()}>
      <SceneMenu />
      <ObjectPicker />
    </side-menu>
  );

  function style() {
    return {
      display: 'flex',
      flexDirection: 'column'
    };
  }
};

export default connect({
  width: state`sideMenu.width`
}, SideMenu);
