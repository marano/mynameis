import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from '@cerebral/react';
import { throttle } from 'lodash';

import controller from './controller';

import { definitions as uiElements } from '../json/ui-elements.json';
import { definitions as entities } from '../json/entities.json';
import sceneTemplate from '../json/world.json';

import Main from './components/Main';

controller.getSignal('entitiesLoaded')({ entities, uiElements });
controller.getSignal('sceneTemplateLoaded')({ sceneTemplate });

window.addEventListener(
  'keypress',
  function (event) {
    controller.getSignal('keyPressed')({
      key: event.key.toLowerCase(),
      sceneDataPath: controller.getState('currentSceneDataPath')
    });
  },
  true
);

ReactDOM.render(
  (
    <Container controller={controller}>
      <Main />
    </Container>
  ),
  document.getElementById('root')
);
