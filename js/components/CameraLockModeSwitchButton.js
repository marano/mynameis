import { connect } from "@cerebral/react"
import { props, state, signal } from "cerebral/tags"
import { linkEvent } from "inferno"

import Button from "./Button"

export default connect(
  {
    currentCameraLockMode: state`${props`scenePath`}.viewport.cameraLockMode`,
    cameraModeChanged: signal`cameraModeChanged`
  },
  CameraLockModeSwitchButton
)

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
  cameraModeChanged({ scenePath, cameraLockMode })
}
