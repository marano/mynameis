import React from 'react';
import { map, filter } from 'lodash' ;
import linkEvent from '../link-event';
import { connect } from '@cerebral/react';
import { props, state, signal } from 'cerebral/tags';

import UiElement from './UiElement';

export default connect({
  uiElemetsIndexes: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.uiElements.*`,
  zIndex: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.zIndex`,
  isSelected: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.isSelected`,
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
  worldObjectSelected: signal`worldObjectSelected`
}, WorldObject);

function WorldObject(props) {
  return (
    <div
      className={className(props)}
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

function className({ isSelected, isAtTopBorder, isAtBottomBorder, isAtLeftBorder, isAtRightBorder }) {
  if (isSelected) {
    return 'world-object-border-color';
  } else {
    return 'world-object-border-color-on-hover';
  }
}

function uiElementDataPath(uiElementIndex, { sceneDataPath, worldObjectId }) {
  return `${sceneDataPath}.worldObjects.${worldObjectId}.uiElements.${uiElementIndex}`;
}

function style({ zIndex, isSelected, tileSize }) {
  const style = {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    zIndex: zIndex + (isSelected ? 1 : 0)
  };
  return style;
}

function onClick({ sceneDataPath, worldObjectId, worldObjectSelected }) {
  worldObjectSelected({ sceneDataPath, worldObjectId });
}
