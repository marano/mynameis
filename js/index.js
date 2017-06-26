import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';
import { throttle } from 'lodash';

import controller from './controller';

import uiElements from '../json/ui-elements.json';
import entities from '../json/entities.json';
import world from '../json/world.json';

import Main from './components/Main';

controller.getSignal('worldLoaded')({ world, entities, uiElements });

window.addEventListener(
  'resize',
  throttle(
    controller.getSignal('windowResized'),
    500,
    { leading: false, trailing: true }
  ),
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
