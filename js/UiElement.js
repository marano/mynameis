import Inferno from 'inferno';

export default function ({ uiElement }) {
  return (
    <ui-element style={style()}></ui-element>
  );

  function style() {
    const image = require(`../sprites/${uiElement.sprite}`);

    return {
      position: 'absolute',
      width: 24,
      height: 24,
      zIndex: uiElement.zIndex,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${image})`
    };
  }
}
