import { connect } from "@cerebral/react"
import { props, state, signal } from "cerebral/tags"
import { linkEvent } from "inferno"

import Button from "./Button"

export default connect(
  {
    currentMode: state`${props`scenePath`}.currentMode`,
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

function onClick({ mode, modeChanged, scenePath }) {
  modeChanged({ mode, scenePath })
}
