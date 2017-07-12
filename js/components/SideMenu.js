import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import ObjectPicker from './ObjectPicker';

function SideMenu({ width }) {
  return (
    <side-menu style={style()}>
      <ObjectPicker />
    </side-menu>
  );

  function style() {
    return {
    };
  }
};

export default connect({
  width: state`sideMenu.width`
}, SideMenu);
