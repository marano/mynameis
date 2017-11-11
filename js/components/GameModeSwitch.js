import GameModeSwitchButton from "./GameModeSwitchButton"

export default function GameModeSwitch() {
  return (
    <div>
      <GameModeSwitchButton mode="editor" />
      <GameModeSwitchButton mode="game" />
    </div>
  )
}
