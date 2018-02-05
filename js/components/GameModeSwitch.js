import GameModeSwitchButton from "./GameModeSwitchButton"

export default function GameModeSwitch({ viewport }) {
  return (
    <div>
      <GameModeSwitchButton mode="editor" viewport={viewport} />
      <GameModeSwitchButton mode="game" viewport={viewport} />
    </div>
  )
}
