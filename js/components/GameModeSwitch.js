import GameModeSwitchButton from './GameModeSwitchButton';

export default function GameModeSwitch() {
  return (
    <div>
      <GameModeSwitchButton gameMode="stop" />
      <GameModeSwitchButton gameMode="play" />
    </div>
  );
}
