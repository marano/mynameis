import { linkEvent } from "inferno"
import { inject } from "mobx-react"
import { get } from "lodash"

import Button from "./Button"

export default inject(
  ({ state, actions: { cameraModeChanged } }, { scenePath }) => ({
    currentCameraLockMode: get(state, `${scenePath}.viewport.cameraLockMode`),
    cameraModeChanged
  })
)(CameraLockModeSwitchButton)

function CameraLockModeSwitchButton(props) {
  const { cameraLockMode, currentCameraLockMode } = props
  const isSelected = cameraLockMode === currentCameraLockMode
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {cameraLockMode}
    </Button>
  )
}

function onClick({ scenePath, cameraLockMode, cameraModeChanged }) {
  cameraModeChanged(scenePath, cameraLockMode)
}
