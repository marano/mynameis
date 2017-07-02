import { find, range, sample, throttle } from 'lodash';
import { cross } from 'd3-array';

export function createWorldTiles({ props: { world } }) {
  const xRange = range(0, world.size.x);
  const yRange = range(0, world.size.y);
  world.tiles = cross(xRange, yRange, createWorldTile);
}

export function fillWorldTiles({ props: { entities, uiElements, world: { tiles, filling: { floor } } } }) {
  tiles.forEach((tile) => {
    tile.worldObjects = [createWorldObject(floor, entities, uiElements)];
  });
}

export function fillWorldObjects({ props: { entities, uiElements, world } }) {
  world.filling.objects.forEach((object) => {
    tileAt(world, object.location.x, object.location.y)
      .worldObjects
      .push(createWorldObject(object.entity, entities, uiElements));
  })
}

function tileAt(world, x, y) {
  return world.tiles[(x * world.size.y) + y];
}

function createWorldTile(x, y) {
  return {
    x, y, worldObjects: []
  };
}

function createWorldObject(name, entities, uiElements) {
  const entity = find(entities.definitions, { name });
  return {
    name,
    uiElements: entity.uiElements.map((uiElement) => createUiElement(uiElement, uiElements))
  };
}

function createUiElement(name, uiElements) {
  const uiElement = find(uiElements.definitions, { name });
  return {
    name: uiElement.name,
    sprite: sample(uiElement.sprites),
    zIndex: uiElement.zIndex || 0
  };
}

export function adjustViewportSize({ state, props: { screenWidth, screenHeight } }) {
  const tileSize = state.get('viewport.tileSize');

  const maxFitSizeX = Math.floor(screenWidth / tileSize);
  const maxFitSizeY = Math.floor(screenHeight / tileSize);

  const worldSizeX = state.get('world.size.x');
  const worldSizeY = state.get('world.size.y');

  const viewportSizeX = Math.min(maxFitSizeX, worldSizeX);
  const viewportSizeY = Math.min(maxFitSizeY, worldSizeY);

  state.set('viewport.size.x', viewportSizeX);
  state.set('viewport.size.y', viewportSizeY);
}

export function updateViewportVisibleTiles({ state }) {
  const viewportPositionX = state.get('viewport.position.x');
  const viewportPositionY = state.get('viewport.position.y');

  const viewportSizeX = state.get('viewport.size.x');
  const viewportSizeY = state.get('viewport.size.y');

  const worldSizeX = state.get('world.size.x');
  const worldSizeY = state.get('world.size.y');

  const minX = Math.max(0, viewportPositionX);
  const minY = Math.max(0, viewportPositionY);


  const maxX = Math.min(viewportPositionX + viewportSizeX, worldSizeX);
  const maxY = Math.min(viewportPositionY + viewportSizeY, worldSizeY);

  var xRange = range(minX, maxX);
  var yRange = range(minY, maxY);

  const world = state.get('world');
  const visibleTiles = cross(xRange, yRange, (x, y) => tileAt(world, x, y));

  state.set('viewport.visibleTiles', visibleTiles);
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

export function handleKeyPress({ state, path, props: { key }}) {
  const handler = keyHandler[key];
  if (handler) {
    handler(state);
    return path.updateViewportVisibleTiles();
  }
}
