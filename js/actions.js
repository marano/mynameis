import { sortBy, cloneDeep, find, range, sample, throttle } from 'lodash';
import { cross } from 'd3-array';

import indexOfTileAt from './index-of-tile-at';

export function setEntitiesUiElements({ state, props: { entities, uiElements } }) {
  entities.forEach(function (entity) {
    entity.uiElements = entity.uiElements.map((name) => find(uiElements, { name }));
  });
}

export function initializeSceneData({ props: { sceneTemplate: { size } }, state }) {
  const tiles = [];
  const viewport = {
    tileSize: 40,
    cameraLockMode: 'locked',
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

  state.push('scenes', { tiles, size, viewport });
  const lastLoadedSceneIndex = state.get('scenes').length - 1;
  const sceneDataPath = `scenes.${lastLoadedSceneIndex}`;
  return { sceneDataPath };
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
    entityName: entity.name,
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
  const sceneSize = state.get(`${sceneDataPath}.size`);
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`);

  const maxFitSize = {
    x: Math.floor(viewportContainerDimension.width / tileSize),
    y: Math.floor(viewportContainerDimension.height / tileSize)
  };

  const viewportSizeByAxis = {
    free: function (axis) { return maxFitSize[axis]; },
    locked: function (axis) { return Math.min(maxFitSize[axis], sceneSize[axis]); }
  }[cameraLockMode];

  const viewportSize = {
    x: viewportSizeByAxis('x'),
    y: viewportSizeByAxis('y')
  };

  state.set(`${sceneDataPath}.viewport.size`, viewportSize);
}

export function adjustViewportPositionForCameraMode({ state, props: { sceneDataPath } }) {
  const currentViewportPosition = state.get(`${sceneDataPath}.viewport.position`);
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`);
  const sceneSize = state.get(`${sceneDataPath}.size`);
  const viewportSize = state.get(`${sceneDataPath}.viewport.size`);

  const newAxisPosition = {
    free: function (axis) {
      return currentViewportPosition[axis];
    },
    locked: function (axis) {
      if (currentViewportPosition[axis] < 0) {
        return 0;
      }
      if (currentViewportPosition[axis] + viewportSize[axis] > sceneSize[axis]) {
        return sceneSize[axis] - viewportSize[axis];
      }
      return currentViewportPosition[axis];
    }
  }[cameraLockMode];

  const newPosition = {
    x: newAxisPosition('x'),
    y: newAxisPosition('y')
  };

  state.set(`${sceneDataPath}.viewport.position`, newPosition);
}

function panViewportPosition(deltaX, deltaY, state, sceneDataPath) {
  const position = state.get(`${sceneDataPath}.viewport.position`);
  const viewportSize = state.get(`${sceneDataPath}.viewport.size`);
  const sceneSize = state.get(`${sceneDataPath}.size`);
  const cameraLockMode = state.get(`${sceneDataPath}.viewport.cameraLockMode`);

  const delta = {
    x: deltaX,
    y: deltaY
  };

  const positionByAxis = {
    free: function (axis) { return position[axis] + delta[axis]; },
    locked: function (axis) {
      const axisCurrentPosition = position[axis];
      const axisDelta = delta[axis];
      const nextPosition = axisCurrentPosition + axisDelta;
      if (axisDelta < 0 && nextPosition < 0) {
        return axisCurrentPosition;
      }
      if (axisDelta > 0 && nextPosition + viewportSize[axis] > sceneSize[axis]) {
        return axisCurrentPosition;
      }
      return nextPosition;
    }
  }[cameraLockMode];

  const newPosition = {
    x: positionByAxis('x'),
    y: positionByAxis('y')
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

export function changeSceneSize({ state, props: { sceneDataPath, axis, delta, mode } }) {
  const sceneAxisSize = state.get(`${sceneDataPath}.size.${axis}`);
  state.set(`${sceneDataPath}.size.${axis}`, sceneAxisSize + delta);

  const currentTiles = cloneDeep(state.get(`${sceneDataPath}.tiles`));
  if (mode == 'start') {
    currentTiles.forEach(function (tile) {
      tile[axis] = tile[axis] + delta;
    });
  }

  let newTiles;
  if (delta > 0) {
    const sceneSize = state.get(`${sceneDataPath}.size`);
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
    if (selectedEntityIndex) {
      const selectedEntity = state.get(`definitions.entities.${selectedEntityIndex}`);
      aditionalTiles.forEach(function (tile) {
        tile.worldObjects.push(createWorldObject(selectedEntity));
      });
    }

    newTiles = aditionalTiles.concat(currentTiles);
  } else if (delta < 0) {
    const sceneSize = state.get(`${sceneDataPath}.size`);
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
  state.set(`${sceneDataPath}.tiles`, sortedTiles);
}
