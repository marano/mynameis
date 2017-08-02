import { linkEvent } from 'inferno';
import { connect } from 'cerebral/inferno';
import { props, state, signal } from 'cerebral/tags';

export default connect({
  sceneDataPath: state`currentSceneDataPath`,
  currentCameraLockMode: state`${state`currentSceneDataPath`}.viewport.cameraLockMode`,
  cameraModeChanged: signal`cameraModeChanged`
}, CameraLockModeSwitchButton);

function CameraLockModeSwitchButton(props) {
  return (
    <button onClick={linkEvent(props, onClick)} style={style(props)}>
      {props.cameraLockMode}
    </button>
  );
}

function onClick({ sceneDataPath, cameraLockMode, cameraModeChanged }) {
  cameraModeChanged({ sceneDataPath, cameraLockMode });
}

function style({ cameraLockMode, currentCameraLockMode }) {
  const isSelected = cameraLockMode == currentCameraLockMode;
  return {
    border: '1px white solid',
    backgroundColor: isSelected ? 'white' : 'black',
    color: isSelected ? 'black' : 'white'
  };
}
