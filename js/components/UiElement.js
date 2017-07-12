import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { props, state } from 'cerebral/tags';

function UiElement({ uiElement, tileSize }) {
  return (
    <ui-element style={style()}></ui-element>
  );

  function style() {
    const sprite = uiElement.sprites[uiElement.currentSpriteIndex || 0];
    const spritePath = require(`../../sprites/${sprite}`);

    return {
      position: 'absolute',
      imageRendering: 'pixelated',
      width: tileSize,
      height: tileSize,
      zIndex: uiElement.zIndex || 0,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${spritePath})`,
      backgroundSize: tileSize
    };
  }
}

export default connect({
  uiElement: state`${props`uiElementDataPath`}`
}, UiElement);
