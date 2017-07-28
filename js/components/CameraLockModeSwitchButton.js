import { linkEvent } from 'inferno';
import { connect } from 'cerebral/inferno';
import { signal } from 'cerebral/tags';

export default connect({
  cameraModeChanged: signal`cameraModeChanged`
}, CameraLockModeSwitchButton);

function CameraLockModeSwitchButton(props) {
  return (
    <button onClick={linkEvent(props, onClick)}>
      {props.cameraLockMode}
    </button>
  );
}

function onClick({ cameraModeChanged, cameraLockMode }) {
  cameraModeChanged({ sceneDataPath: 'scene', cameraLockMode });
}
