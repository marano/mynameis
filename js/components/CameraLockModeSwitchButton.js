import { linkEvent } from "inferno"
import { inject } from "mobx-react"
import { get } from "lodash"

import Button from "./Button"

export default inject(({ store }, { scenePath }) => ({
  currentCameraLockMode: get(store, `${scenePath}.viewport.cameraLockMode`),
  cameraModeChanged: () => null
}))(CameraLockModeSwitchButton)

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
