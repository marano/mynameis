import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';

import controller from './controller';

import uiElements from '../json/ui-elements.json';
import entities from '../json/entities.json';
import world from '../json/world.json';

import App from './App';

controller.getSignal('worldLoaded')({ world, entities, uiElements });

Inferno.render(
  (
    <Container controller={controller}>
      <App />
    </Container>
  ),
  document.getElementById("app")
);
