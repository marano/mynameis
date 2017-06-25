import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

import UiElement from './UiElement';

export default function WorldObject({ worldObject }) {
  return (
    <world-object style={style()}>
      {worldObject.uiElements.map((uiElement) => <UiElement uiElement={uiElement} />)}
    </world-object>
  );

  function style() {
    return {
      position: 'absolute',
      width: 24,
      height: 24
    };
  }
};
