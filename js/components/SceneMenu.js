import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import IncreaseSceneButton from './IncreaseSceneButton';

function SceneMenu({ sceneSize }) {
  return (
    <scene-menu style={style()}>
      <div style={buttonWrapperStyle(1, 4)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(2, 4)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(4, 7)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(4, 6)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(7, 4)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(6, 4)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(4, 2)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(4, 1)}>
        <IncreaseSceneButton />
      </div>
      <div style={buttonWrapperStyle(4, '3/6')}>
        <span style="font-size: 12px; font-family: monospace">{sceneSize.x}x{sceneSize.y}</span>
      </div>
    </scene-menu>
  );

  function style() {
    return {
      padding: 10,
      display: 'grid',
      gridTemplateRows: 'repeat(7, 20px)',
      gridTemplateColumns: 'repeat(7, 20px)',
      color: 'white',
      alignItems: 'centerx`'
    };
  }

  function buttonWrapperStyle(row, column) {
    return {
      gridRow: row,
      gridColumn: column,
      textAlign: 'center'
    }
  }
};

export default connect({
  sceneSize: state`scene.size`
}, SceneMenu);
