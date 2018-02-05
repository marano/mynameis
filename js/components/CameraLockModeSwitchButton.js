import { linkEvent } from "inferno"
import { inject } from "mobx-react"
import { get } from "lodash"

import Button from "./Button"

export default inject(({ state, actions }, { viewport }) => {
  const scene = get(state, viewport.currentScenePath)
  return {
    currentCameraLockMode: scene && scene.viewport.cameraLockMode,
    actions
  }
})(CameraLockModeSwitchButton)

function CameraLockModeSwitchButton(props) {
  const { cameraLockMode, currentCameraLockMode } = props
  const isSelected = cameraLockMode === currentCameraLockMode
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {cameraLockMode}
    </Button>
  )
}

function onClick({ viewport, cameraLockMode, actions: { cameraModeChanged } }) {
  cameraModeChanged(viewport, cameraLockMode)
}
