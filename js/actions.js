import { find, range, sample, throttle } from 'lodash';
import { cross } from 'd3-array';

export function initializeSceneData({ props: { sceneDataPath, sceneTemplate: { size } }, state }) {
  const tiles = [];
  const viewport = {
    visibleTilesIndexes: [],
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

export function createWorldTiles({ props: { sceneDataPath, sceneTemplate: { size } }, state }) {
  const xRange = range(0, size.x);
  const yRange = range(0, size.y);
  const tiles = cross(xRange, yRange, createWorldTile);
  state.set(`${sceneDataPath}.tiles`, tiles);
}

export function fillWorldTiles({ props: { sceneDataPath, sceneTemplate: { filling: { floor } } }, state }) {
  const entities = state.get('definitions.entities');
  const uiElements = state.get('definitions.uiElements');
  const tiles = state.get(`${sceneDataPath}.tiles`);

  tiles.forEach((tile, index) => {
    state.push(`${sceneDataPath}.tiles.${index}.worldObjects`, createWorldObject(floor, entities, uiElements));
  });
}

export function fillWorldObjects({ props: { sceneDataPath, sceneTemplate: { filling: { objects } } }, state }) {
  const entities = state.get('definitions.entities');
  const uiElements = state.get('definitions.uiElements');
  const scene = state.get(sceneDataPath);

  objects.forEach((object, index) => {
    let tileIndex = indexOfTileAt(scene, object.location.x, object.location.y);
    state.push(`${sceneDataPath}.tiles.${tileIndex}.worldObjects`, createWorldObject(object.entity, entities, uiElements));
  })
}

function indexOfTileAt(scene, x, y) {
  return (x * scene.size.y) + y;
}

function createWorldTile(x, y) {
  return {
    x, y, worldObjects: []
  };
}

function createWorldObject(name, entities, uiElements) {
  const entity = find(entities, { name });
  return {
    name,
    uiElements: entity.uiElements.map((uiElement) => createUiElement(uiElement, uiElements))
  };
}

function createUiElement(name, uiElements) {
  const uiElement = find(uiElements, { name });
  return {
    name: uiElement.name,
    sprite: sample(uiElement.sprites),
    zIndex: uiElement.zIndex || 0
  };
}

export function adjustViewportSize({ state, props: { sceneDataPath, viewportWidth, viewportHeight } }) {
  const tileSize = state.get(`${sceneDataPath}.viewport.tileSize`);

  const maxFitSizeX = Math.floor(viewportWidth / tileSize);
  const maxFitSizeY = Math.floor(viewportHeight / tileSize);

  const worldSizeX = state.get(`${sceneDataPath}.size.x`);
  const worldSizeY = state.get(`${sceneDataPath}.size.y`);

  const viewportSizeX = Math.min(maxFitSizeX, worldSizeX);
  const viewportSizeY = Math.min(maxFitSizeY, worldSizeY);

  state.set(`${sceneDataPath}.viewport.size.x`, viewportSizeX);
  state.set(`${sceneDataPath}.viewport.size.y`, viewportSizeY);
}

export function updateViewportVisibleTiles({ state, props: { sceneDataPath } }) {
  const viewportPositionX = state.get(`${sceneDataPath}.viewport.position.x`);
  const viewportPositionY = state.get(`${sceneDataPath}.viewport.position.y`);

  const viewportSizeX = state.get(`${sceneDataPath}.viewport.size.x`);
  const viewportSizeY = state.get(`${sceneDataPath}.viewport.size.y`);

  const worldSizeX = state.get(`${sceneDataPath}.size.x`);
  const worldSizeY = state.get(`${sceneDataPath}.size.y`);

  const minX = Math.max(0, viewportPositionX);
  const minY = Math.max(0, viewportPositionY);

  const maxX = Math.min(viewportPositionX + viewportSizeX, worldSizeX);
  const maxY = Math.min(viewportPositionY + viewportSizeY, worldSizeY);

  var xRange = range(minX, maxX);
  var yRange = range(minY, maxY);

  const scene = state.get(sceneDataPath);
  const visibleTilesIndexes = cross(xRange, yRange, (x, y) => indexOfTileAt(scene, x, y));

  state.set(`${sceneDataPath}.viewport.visibleTilesIndexes`, visibleTilesIndexes);
}

function panViewportPosition(deltaX, deltaY, state) {
  const position = state.get('viewport.position');
  const newPosition = {
    x: position.x + deltaX,
    y: position.y + deltaY
  };
  state.set('viewport.position', newPosition);
}

const keyHandler = {
  w: function (state) {
    panViewportPosition(0, -1, state);
  },
  s: function (state) {
    panViewportPosition(0, +1, state);
  },
  a: function (state) {
    panViewportPosition(-1, 0, state);
  },
  d: function (state) {
    panViewportPosition(+1, 0, state);
  }
}

export function handleKeyPress({ state, path: { updateViewportVisibleTiles }, props: { key }}) {
  const handler = keyHandler[key];
  if (handler) {
    handler(state);
    return updateViewportVisibleTiles();
  }
}
