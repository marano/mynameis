import Inferno from 'inferno';
import { Container } from 'cerebral/inferno';
import { throttle } from 'lodash';

import controller from './controller';

import uiElements from '../json/ui-elements.json';
import entities from '../json/entities.json';
import world from '../json/world.json';

import Main from './components/Main';

controller.getSignal('worldLoaded')({ world, entities, uiElements, ...getScreenDimensions() });

window.addEventListener(
  'resize',
  throttle(
    function () {
      controller.getSignal('windowResized')(getScreenDimensions());
    },
    500,
    { leading: false, trailing: true }
  ),
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
      <Main />
    </Container>
  ),
  document.getElementById('root')
);

function getScreenDimensions() {
  const screenWidth = document.documentElement.clientWidth;
  const screenHeight = document.documentElement.clientHeight;
  return { screenWidth, screenHeight };
}
