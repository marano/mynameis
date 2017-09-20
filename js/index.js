import Inferno from 'inferno';
import { Container } from '@cerebral/inferno';
import { throttle } from 'lodash';

import controller from './controller';

import { definitions as uiElements } from '../json/ui-elements.json';
import { definitions as entities } from '../json/entities.json';
import sceneTemplate from '../json/world.json';

import Main from './components/Main';

Inferno.options.recyclingEnabled = true;

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

Inferno.render(
  (
    <Container controller={controller}>
      <Main />
    </Container>
  ),
  document.getElementById('root')
);
