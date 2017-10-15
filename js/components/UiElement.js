import { props, state } from 'cerebral/tags';
import { css } from "emotion";

const style = ({ uiElement, tileSize, spritePath }) => css`
  position: 'absolute';
  top: 0;
  left: 0;
  image-rendering: pixelated;
  width: ${tileSize}px;
  height: ${tileSize}px;
  z-index: ${uiElement.zIndex || 0};
  background-repeat: no-repeat;
  background-image: url(${spritePath});
  background-size: ${tileSize}px;

`;

export default connect({
  uiElement: state`${props`uiElementDataPath`}`
}, UiElement);

function UiElement(props) {
  return <div className={style({ ...props, spritePath: spritePath(props) })}></div>;
}

function spritePath({ uiElement }) {
  const sprite = uiElement.sprites[uiElement.currentSpriteIndex || 0];
  return require(`../../sprites/${sprite}`);
}
