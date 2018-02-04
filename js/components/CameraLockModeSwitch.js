import CameraLockModeSwitchButton from "./CameraLockModeSwitchButton"

export default function CameraLockModeSwitch({ viewport }) {
  return (
    <div>
      <CameraLockModeSwitchButton viewport={viewport} cameraLockMode="free" />
      <CameraLockModeSwitchButton viewport={viewport} cameraLockMode="locked" />
    </div>
  )
}
