import CameraLockModeSwitchButton from "./CameraLockModeSwitchButton"

export default function CameraLockModeSwitch({ sceneDataPath }) {
  return (
    <div>
      <CameraLockModeSwitchButton
        sceneDataPath={sceneDataPath}
        cameraLockMode="free"
      />
      <CameraLockModeSwitchButton
        sceneDataPath={sceneDataPath}
        cameraLockMode="locked"
      />
    </div>
  )
}
