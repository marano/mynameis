import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import UiElement from './UiElement';

function WorldObject({ worldObject }) {
  return (
    <div style={style()}>
      {worldObject.uiElements.map((uiElement) => <UiElement uiElement={uiElement} />)}
    </div>
  );

  function style() {
    return {
      position: 'absolute',
      height: 24,
      width: 24,
      left: worldObject.location.x * 24,
      top: worldObject.location.y * 24
    }
  }
};

export default connect({
  worldObject: state`world.objects.${props`objectIndex`}`
}, WorldObject);
