import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

function SideMenu({ width }) {
  return (
    <side-menu style={style()}>
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
