import { linkEvent } from "inferno"
import { inject } from "mobx-react"
import { get } from "lodash"

import Button from "./Button"

export default inject(({ state, actions }, { viewport }) => {
  const scene = get(state, viewport.currentScenePath)
  return {
    scenePath: viewport.currentScenePath,
    currentMode: scene && scene.currentMode,
    actions
  }
})(GameModeSwitchButton)

function GameModeSwitchButton(props) {
  const { mode, currentMode } = props
  const isSelected = mode === currentMode
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {mode}
    </Button>
  )
}

function onClick({ mode, scenePath, actions: { modeChanged } }) {
  modeChanged(mode, scenePath)
}
