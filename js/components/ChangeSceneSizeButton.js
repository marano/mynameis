import { state, signal } from 'cerebral/tags';

export default connect({
  sceneDataPath: state`currentSceneDataPath`,
  sceneSizeChanged: signal`sceneSizeChanged`
}, ChangeSceneSizeButton);

function ChangeSceneSizeButton(props) {
  return (
    <div style={style()} onClick={linkEvent(props, onClick)}>
      {props.delta > 0 ? '+' : '-'}
    </div>
  );
}

function onClick({ sceneDataPath, axis, delta, mode, sceneSizeChanged }) {
  sceneSizeChanged({ sceneDataPath, axis, delta, mode });
}

function style() {
  return {
    border: '1px solid white',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    cursor: 'pointer'
  }
}
