import { sortBy, cloneDeep, find, range, sample, throttle } from 'lodash';
import { cross } from 'd3-array';

import indexOfTileAt from './index-of-tile-at';

export function setEntitiesUiElements({ state, props: { entities, uiElements } }) {
  entities.forEach(function (entity) {
    entity.uiElements = entity.uiElements.map((name) => find(uiElements, { name }));
  });
}

export function initializeSceneData({ props: { sceneDataPath, sceneTemplate: { size } }, state }) {
  const tiles = [];
  const viewport = {
    tileSize: 40,
    size: {
      x: 0,
      y: 0
    },
    position: {
      x: 0,
      y: 0
    }
  };

  state.set(sceneDataPath, { tiles, size, viewport });
}

export function createSceneTiles({ props: { sceneDataPath, sceneTemplate: { size } }, state }) {
  const xRange = range(0, size.x);
  const yRange = range(0, size.y);
  const tiles = cross(xRange, yRange, createSceneTile);
  state.set(`${sceneDataPath}.tiles`, tiles);
}

export function fillSceneTiles({ props: { sceneDataPath, sceneTemplate: { filling: { floor } } }, state }) {
  const entities = state.get('definitions.entities');
  const entity = find(entities, { name: floor });
  const tiles = cloneDeep(state.get(`${sceneDataPath}.tiles`));

  tiles.forEach((tile) => {
    tile.worldObjects.push(createWorldObject(entity));
  });

  state.set(`${sceneDataPath}.tiles`, tiles);
}

export function fillWorldObjects({ props: { sceneDataPath, sceneTemplate: { filling: { objects } } }, state }) {
  const entities = state.get('definitions.entities');
  const sceneSizeY = state.get(`${sceneDataPath}.size.y`);

  objects.forEach((object, index) => {
    let tileIndex = indexOfTileAt(sceneSizeY, object.location.x, object.location.y);
    const entity = find(entities, { name: object.entity });
    state.push(`${sceneDataPath}.tiles.${tileIndex}.worldObjects`, createWorldObject(entity));
  });
}

function createSceneTile(x, y) {
  return {
    x, y, worldObjects: []
  };
}

function createWorldObject(entity) {
  return {
    name,
    uiElements: entity.uiElements.map(createWorldObjectUiElement)
  };
}

function createWorldObjectUiElement(uiElement) {
  return {
    ...uiElement,
    currentSpriteIndex: sample(range(0, uiElement.sprites.length))
  };
}

export function adjustViewportSize({ state, props: { sceneDataPath, viewportWidth, viewportHeight } }) {
  const tileSize = state.get(`${sceneDataPath}.viewport.tileSize`);

  const maxFitSizeX = Math.floor(viewportWidth / tileSize);
  const maxFitSizeY = Math.floor(viewportHeight / tileSize);

  const sceneSizeX = state.get(`${sceneDataPath}.size.x`);
  const sceneSizeY = state.get(`${sceneDataPath}.size.y`);

  const viewportSizeX = Math.min(maxFitSizeX, sceneSizeX);
  const viewportSizeY = Math.min(maxFitSizeY, sceneSizeY);

  state.set(`${sceneDataPath}.viewport.size.x`, viewportSizeX);
  state.set(`${sceneDataPath}.viewport.size.y`, viewportSizeY);
}

function panViewportPosition(deltaX, deltaY, state, sceneDataPath) {
  const position = state.get(`${sceneDataPath}.viewport.position`);
  const newPosition = {
    x: position.x + deltaX,
    y: position.y + deltaY
  };
  state.set(`${sceneDataPath}.viewport.position`, newPosition);
}

const keyHandler = {
  w: function (state, sceneDataPath) {
    panViewportPosition(0, -1, state, sceneDataPath);
  },
  s: function (state, sceneDataPath) {
    panViewportPosition(0, +1, state, sceneDataPath);
  },
  a: function (state, sceneDataPath) {
    panViewportPosition(-1, 0, state, sceneDataPath);
  },
  d: function (state, sceneDataPath) {
    panViewportPosition(+1, 0, state, sceneDataPath);
  }
}

export function handleKeyPress({ state, props: { key, sceneDataPath }}) {
  const handler = keyHandler[key];
  if (handler) {
    handler(state, sceneDataPath);
  }
}

export function addRowToScene({ state }) {
  // Change actual size
  const sceneSizeY = state.get('scene.size.y');
  state.set('scene.size.y', sceneSizeY + 1);

  // Move stuff because of its a prepend
  const currentTiles = cloneDeep(state.get('scene.tiles'));
  currentTiles.forEach(function (tile) {
    tile.y = tile.y + 1;
  });

  // Create additional tiles
  const sceneSizeX = state.get('scene.size.x');
  const aditionalTiles = cross(range(0, sceneSizeX), [0], createSceneTile);

  // Fill selected entity
  const selectedEntityIndex = state.get('objectPicker.selectedEntityIndex');
  const selectedEntity = state.get(`definitions.entities.${selectedEntityIndex}`);
  aditionalTiles.forEach(function (tile) {
    tile.worldObjects.push(createWorldObject(selectedEntity));
  });

  const newTiles = _.sortBy(aditionalTiles.concat(currentTiles), ['x', 'y']);
  state.set('scene.tiles', newTiles);
}
