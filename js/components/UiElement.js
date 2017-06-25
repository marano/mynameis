import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state, props } from 'cerebral/tags';

function UiElement({ uiElement, tileSize }) {
  return (
    <ui-element style={style()}></ui-element>
  );

  function style() {
    const image = require(`../../sprites/${uiElement.sprite}`);

    return {
      position: 'absolute',
      imageRendering: 'pixelated',
      width: tileSize,
      height: tileSize,
      zIndex: uiElement.zIndex,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${image})`,
      backgroundSize: tileSize
    };
  }
}

export default connect({
  tileSize: state`viewport.tileSize`,
  uiElement: state`world.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.${props`uiElementIndex`}`
}, UiElement);
