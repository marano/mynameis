import CameraLockModeSwitchButton from "./CameraLockModeSwitchButton"

export default function CameraLockModeSwitch() {
  return (
    <div>
      <CameraLockModeSwitchButton cameraLockMode="free" />
      <CameraLockModeSwitchButton cameraLockMode="locked" />
    </div>
  )
}
