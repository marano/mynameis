import Inferno from 'inferno';

export default function ({ uiElement }) {
  return (
    <div style={style()}></div>
  );

  function style() {
    const image = require(`../sprites/${uiElement.sprite}`);

    return {
      width: 24,
      height: 24,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${image})`
    };
  }
}
