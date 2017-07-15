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
    containerDimension: {
      width: null,
      height: null
    },
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

export function adjustViewportSize({ state, props: { sceneDataPath } }) {
  const viewportContainerDimension = state.get(`${sceneDataPath}.viewport.containerDimension`);
  const tileSize = state.get(`${sceneDataPath}.viewport.tileSize`);

  const maxFitSizeX = Math.floor(viewportContainerDimension.width / tileSize);
  const maxFitSizeY = Math.floor(viewportContainerDimension.height / tileSize);

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

export function changeSceneSize({ state, props: { axis, delta, mode } }) {
  const sceneAxisSize = state.get(`scene.size.${axis}`);
  state.set(`scene.size.${axis}`, sceneAxisSize + delta);

  const currentTiles = cloneDeep(state.get('scene.tiles'));
  if (mode == 'start') {
    currentTiles.forEach(function (tile) {
      tile[axis] = tile[axis] + delta;
    });
  }

  let newTiles;
  if (delta > 0) {
    const sceneSize = state.get('scene.size');
    const deltaRange = {
      start: () => range(0, delta),
      end: () => range(sceneSize[axis] - 1, (sceneSize[axis] + delta - 1))
    }[mode]();
    const otherAxisSizeRange = range(0, sceneSize[{ x: 'y', y: 'x' }[axis]]);
    const aditionalTiles = {
      x:  () => cross(deltaRange, otherAxisSizeRange, createSceneTile),
      y: () => cross(otherAxisSizeRange, deltaRange, createSceneTile)
    }[axis]();

    const selectedEntityIndex = state.get('objectPicker.selectedEntityIndex');
    const selectedEntity = state.get(`definitions.entities.${selectedEntityIndex}`);
    aditionalTiles.forEach(function (tile) {
      tile.worldObjects.push(createWorldObject(selectedEntity));
    });

    newTiles = aditionalTiles.concat(currentTiles);
  } else if (delta < 0) {
    const sceneSize = state.get('scene.size');
    newTiles = _.reject(
      currentTiles,
      function (tile) {
        return tile.x < 0 || tile.y < 0 || tile.x >= sceneSize.x || tile.y >= sceneSize.y;
      }
    );
  } else {
    newTiles = currentTiles;
  }

  const sortedTiles = _.sortBy(newTiles, ['x', 'y']);
  state.set('scene.tiles', sortedTiles);
}
