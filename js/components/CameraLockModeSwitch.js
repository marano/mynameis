import CameraLockModeSwitchButton from "./CameraLockModeSwitchButton"

export default function CameraLockModeSwitch({ scenePath }) {
  return (
    <div>
      <CameraLockModeSwitchButton scenePath={scenePath} cameraLockMode="free" />
      <CameraLockModeSwitchButton
        scenePath={scenePath}
        cameraLockMode="locked"
      />
    </div>
  )
}
