import { linkEvent } from 'inferno';
import { connect } from 'cerebral/inferno';
import { signal } from 'cerebral/tags';

function ChangeSceneSizeButton(props) {
  return (
    <div style={style()} onClick={linkEvent(props, onClick)}>
      +
    </div>
  );
}

function onClick({ sceneSizeChanged, axis, delta }) {
  sceneSizeChanged({ sceneDataPath: 'scene', axis, delta });
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

export default connect({
  sceneSizeChanged: signal`sceneSizeChanged`
}, ChangeSceneSizeButton);
