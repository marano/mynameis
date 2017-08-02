import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import ChangeSceneSizeButton from './ChangeSceneSizeButton';

export default connect({
  sceneSize: state`scene.size`
}, SceneSizeEditor);

function SceneSizeEditor({ sceneSize }) {
  return (
    <scene-size-editor style={style()}>
      <div style={buttonWrapperStyle(1, 4)}>
        <ChangeSceneSizeButton axis="y" delta={1} mode="start" />
      </div>
      <div style={buttonWrapperStyle(2, 4)}>
        <ChangeSceneSizeButton axis="y" delta={-1} mode="start" />
      </div>
      <div style={buttonWrapperStyle(4, 7)}>
        <ChangeSceneSizeButton axis="x" delta={1} mode="end" />
      </div>
      <div style={buttonWrapperStyle(4, 6)}>
        <ChangeSceneSizeButton axis="x" delta={-1} mode="end" />
      </div>
      <div style={buttonWrapperStyle(7, 4)}>
        <ChangeSceneSizeButton axis="y" delta={1} mode="end" />
      </div>
      <div style={buttonWrapperStyle(6, 4)}>
        <ChangeSceneSizeButton axis="y" delta={-1} mode="end" />
      </div>
      <div style={buttonWrapperStyle(4, 1)}>
        <ChangeSceneSizeButton axis="x" delta={1} mode="start" />
      </div>
      <div style={buttonWrapperStyle(4, 2)}>
        <ChangeSceneSizeButton axis="x" delta={-1} mode="start" />
      </div>
      <div style={buttonWrapperStyle(4, '3/6')}>
        <span style="font-size: 12px; font-family: monospace">
          {sceneSize.x}x{sceneSize.y}
        </span>
      </div>
    </scene-size-editor>
  );
};

function style() {
  return {
    padding: 10,
    display: 'grid',
    gridTemplateRows: 'repeat(7, 20px)',
    gridTemplateColumns: 'repeat(7, 20px)',
    color: 'white',
    justifyContent: 'center'
  };
}

function buttonWrapperStyle(row, column) {
  return {
    gridRow: row,
    gridColumn: column,
    textAlign: 'center'
  }
}