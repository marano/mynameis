import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';

import controller from './controller';

import App from './App';

import entities from '../json/entities.json';
import world from '../json/world.json';

controller.getSignal('worldLoaded')({ world });

Inferno.render(
  (
    <Container controller={controller}>
      <App />
    </Container>
  ),
  document.getElementById("app")
);
