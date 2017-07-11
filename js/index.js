import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';
import { throttle } from 'lodash';

import controller from './controller';

import { definitions as uiElements } from '../json/ui-elements.json';
import { definitions as entities } from '../json/entities.json';
import sceneTemplate from '../json/world.json';

import Main from './components/Main';

Inferno.options.recyclingEnabled = true;

controller.getSignal('uiElementsLoaded')({ uiElements });
controller.getSignal('entitiesLoaded')({ entities });
controller.getSignal('sceneTemplateLoaded')({ sceneDataPath: 'scene', sceneTemplate });

window.addEventListener(
  'keypress',
  function (event) {
    controller.getSignal('keyPressed')({ key: event.key.toLowerCase() });
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
