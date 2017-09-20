import { linkEvent } from 'inferno';
import { connect } from '@cerebral/inferno';
import { props, state, signal } from 'cerebral/tags';

import UiElement from './UiElement';

export default connect({
  uiElemetsIndexes: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.uiElements.*`,
  zIndex: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.zIndex`,
  isSelected: state`${props`sceneDataPath`}.tiles.${props`tileIndex`}.worldObjects.${props`worldObjectIndex`}.isSelected`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
  worldObjectSelected: signal`worldObjectSelected`
}, WorldObject);

function WorldObject(props) {
  return (
    <div
      className="world-object-border-color-on-hover"
      style={style(props)}
      onClick={linkEvent(props, onClick)}
    >
      {
        props.uiElemetsIndexes
          .map(function (uiElementIndex) {
            return (
              <UiElement
                uiElementDataPath={uiElementDataPath(uiElementIndex, props)}
                tileSize={props.tileSize}
              />
            );
          })
      }
    </div>
  );
};

function uiElementDataPath(uiElementIndex, { sceneDataPath, tileIndex, worldObjectIndex }) {
  return `${sceneDataPath}.tiles.${tileIndex}.worldObjects.${worldObjectIndex}.uiElements.${uiElementIndex}`;
}

function style({ zIndex, isSelected, tileSize }) {
  const style = {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    zIndex
  };
  if (isSelected) {
    style.border = '2px solid white';
  }
  return style;
}

function onClick({ sceneDataPath, tileIndex, worldObjectIndex, worldObjectSelected }) {
  worldObjectSelected({ sceneDataPath, tileIndex, worldObjectIndex });
}
