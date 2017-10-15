import { props, state, signal } from 'cerebral/tags';

import Button from './Button';

export default connect({
  sceneDataPath: state`currentSceneDataPath`,
  currentCameraLockMode: state`${state`currentSceneDataPath`}.viewport.cameraLockMode`,
  cameraModeChanged: signal`cameraModeChanged`
}, CameraLockModeSwitchButton);

function CameraLockModeSwitchButton(props) {
  const { cameraLockMode, currentCameraLockMode } = props;
  const isSelected = cameraLockMode == currentCameraLockMode;
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {cameraLockMode}
    </Button>
  );
}

function onClick({ sceneDataPath, cameraLockMode, cameraModeChanged }) {
  cameraModeChanged({ sceneDataPath, cameraLockMode });
}
