import { state, signal } from "cerebral/tags"

import Button from "./Button"

export default connect(
  {
    currentMode: state`currentMode`,
    modeChanged: signal`modeChanged`
  },
  GameModeSwitchButton
)

function GameModeSwitchButton(props) {
  const { mode, currentMode } = props
  const isSelected = mode === currentMode
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {mode}
    </Button>
  )
}

function onClick({ mode, modeChanged }) {
  modeChanged({ mode })
}
