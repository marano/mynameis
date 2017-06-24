import Inferno from 'inferno';

import App from './App';

import entities from '../json/entities.json';
import world from '../json/world.json';

Inferno.render(
  <App />,
  document.getElementById("app")
);
