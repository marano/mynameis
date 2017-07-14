import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

function SceneMenu({ width }) {
  return (
    <scene-menu style={style()}>
      <button>New scene</button>
      <button>Save scene</button>
    </scene-menu>
  );

  function style() {
    return {
      padding: 10
    };
  }
};

export default connect({
  width: state`sideMenu.width`
}, SceneMenu);
