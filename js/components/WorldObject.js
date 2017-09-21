import { map, filter } from 'lodash' ;
import { linkEvent } from 'inferno';
import { connect } from '@cerebral/inferno';
import { props, state, signal } from 'cerebral/tags';

import { computeIsElementAtAxis } from '../computes';

import UiElement from './UiElement';

export default connect({
  uiElemetsIndexes: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.uiElements.*`,
  zIndex: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.zIndex`,
  isSelected: state`${props`sceneDataPath`}.worldObjects.${props`worldObjectId`}.isSelected`,
  isAtTopBorder: computeIsElementAtAxis('start', 'y', props`worldObjectId`, props`sceneDataPath`),
  isAtBottomBorder: computeIsElementAtAxis('end', 'y', props`worldObjectId`, props`sceneDataPath`),
  isAtLeftBorder: computeIsElementAtAxis('start', 'x', props`worldObjectId`, props`sceneDataPath`),
  isAtRightBorder: computeIsElementAtAxis('end', 'x', props`worldObjectId`, props`sceneDataPath`),
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
    return map(
      filter(
        map(
          {
            'world-object-border-color': true,
            'is-at-top-border': isAtTopBorder,
            'is-at-bottom-border': isAtBottomBorder,
            'is-at-left-border': isAtLeftBorder,
            'is-at-right-border': isAtRightBorder,
          },
          function (apply, name) { return { name, apply } }
        ),
        'apply',
      ),
      'name'
    ).join(' ');
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
