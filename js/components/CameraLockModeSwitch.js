import CameraLockModeSwitchButton from './CameraLockModeSwitchButton';

export default function CameraLockModeSwitch({ cameraModeChanged }) {
  return (
    <div>
      <CameraLockModeSwitchButton cameraLockMode="free" />
      <CameraLockModeSwitchButton cameraLockMode="locked" />
    </div>
  );
}
