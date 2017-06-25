import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';

import controller from './controller';

import uiElements from '../json/ui-elements.json';
import entities from '../json/entities.json';
import world from '../json/world.json';

import Main from './components/Main';

controller.getSignal('worldLoaded')({ world, entities, uiElements });

Inferno.render(
  (
    <Container controller={controller}>
      <Main />
    </Container>
  ),
  document.getElementById('root')
);
