import { state } from 'cerebral/tags';

import CameraLockModeSwitch from './CameraLockModeSwitch';
import SceneSizeEditor from './SceneSizeEditor';
import ObjectPicker from './ObjectPicker';
import SelectedWorldObjectMenu from './SelectedWorldObjectMenu';

export default connect({
  width: state`sideMenu.width`
}, SideMenu);

function SideMenu({ width }) {
  return (
    <side-menu style={style()}>
      {[
        CameraLockModeSwitch,
        SceneSizeEditor,
        ObjectPicker,
        SelectedWorldObjectMenu
      ].map((Component, index)=> (
        <div key={index} style={itemStyle()}>
          <Component />
        </div>
      ))}
    </side-menu>
  );
};

function style() {
  return {
    display: 'flex',
    flexDirection: 'column'
  };
}

function itemStyle() {
  return {
    border: '2px solid white',
    margin: '10px 0',
    padding: '10px 10px'
  };
}
