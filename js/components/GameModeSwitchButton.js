import { state, signal } from "cerebral/tags"

import Button from "./Button"

export default connect(
  {
    currentGameMode: state`currentGameMode`,
    gameModeChanged: signal`gameModeChanged`
  },
  GameModeSwitchButton
)

function GameModeSwitchButton(props) {
  const { gameMode, currentGameMode } = props
  const isSelected = gameMode === currentGameMode
  return (
    <Button onClick={linkEvent(props, onClick)} isSelected={isSelected}>
      {gameMode}
    </Button>
  )
}

function onClick({ gameMode, gameModeChanged }) {
  gameModeChanged({ gameMode })
}
