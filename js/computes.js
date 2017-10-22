import { compute } from 'cerebral';
import { props, state } from 'cerebral/tags';
import { range } from 'lodash';
import { cross } from 'd3-array';

import indexOfTileAt from './index-of-tile-at';

export function computeVisibleTileIndexes(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.viewport.position.x`,
    state`${sceneDataPath}.viewport.position.y`,
    state`${sceneDataPath}.viewport.size.x`,
    state`${sceneDataPath}.viewport.size.y`,
    state`${sceneDataPath}.size.x`,
    state`${sceneDataPath}.size.y`,
    function (viewportPositionX, viewportPositionY, viewportSizeX, viewportSizeY, sceneSizeX, sceneSizeY) {
      const minX = Math.max(0, viewportPositionX - 2);
      const minY = Math.max(0, viewportPositionY - 2);

      const maxX = Math.min(viewportPositionX + viewportSizeX + 2, sceneSizeX);
      const maxY = Math.min(viewportPositionY + viewportSizeY + 2, sceneSizeY);

      var xRange = range(minX, maxX);
      var yRange = range(minY, maxY);

      return cross(xRange, yRange, (x, y) => indexOfTileAt(sceneSizeY, x, y));
    }
  );
}

export function computeSelectedWorldObject(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.selectedWorldObjectId`,
    function (worldObjectId, get) {
      return get(state`${sceneDataPath}.worldObjects.${worldObjectId}`);
    }
  );
}

export const computeWorldObjectSelectable = compute(
  state`objectPicker.selectedEntityIndex`,
  function (selectedEntityIndex) {
    return !selectedEntityIndex;
  }
);

export function computeSelectedTile(sceneDataPath) {
  return compute(
    state`${sceneDataPath}.tiles.${state`editor.selectedTileIndex`}`
  );
}
