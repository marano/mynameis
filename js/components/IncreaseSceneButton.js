import { linkEvent } from 'inferno';
import { connect } from 'cerebral/inferno';
import { signal } from 'cerebral/tags';

function IncreaseSceneButton({ sceneRowAdded }) {
  return (
    <div style={style()} onClick={linkEvent(sceneRowAdded, onClick)}>
      +
    </div>
  );
}

function onClick(sceneRowAdded) {
  sceneRowAdded();
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
  sceneRowAdded: signal`sceneRowAdded`
}, IncreaseSceneButton);
