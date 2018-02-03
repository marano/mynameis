import { linkEvent } from "inferno"
import { inject } from "mobx-react"
import { get } from "lodash"

import Button from "./Button"

export default inject(({ state, actions: { modeChanged } }, { scenePath }) => ({
  currentMode: get(state, `${scenePath}.currentMode`),
  modeChanged
}))(GameModeSwitchButton)

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
