import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';
import { throttle } from 'lodash';

import controller from './controller';

import uiElements from '../json/ui-elements.json';
import entities from '../json/entities.json';
import world from '../json/world.json';

import Main from './components/Main';

Inferno.options.recyclingEnabled = true;

controller.getSignal('worldLoaded')({ world, entities, uiElements });

let viewportRef = null;

const onWindowResize = throttle(
  function () {
    if (viewportRef) {
      const viewportWidth = viewportRef.offsetWidth;
      const viewportHeight = viewportRef.offsetHeight;
      controller.getSignal('viewportResized')({ viewportWidth, viewportHeight });
    }
  },
  200,
  { leading: false, trailing: true }
);

window.addEventListener(
  'resize',
  onWindowResize,
  true
);

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
      <Main setViewportRef={setViewportRef} />
    </Container>
  ),
  document.getElementById('root')
);

function setViewportRef(viewport) {
  viewportRef = viewport;
  onWindowResize();
}
