import GameModeSwitchButton from "./GameModeSwitchButton"

export default function GameModeSwitch({ scenePath }) {
  return (
    <div>
      <GameModeSwitchButton mode="editor" scenePath={scenePath} />
      <GameModeSwitchButton mode="game" scenePath={scenePath} />
    </div>
  )
}
