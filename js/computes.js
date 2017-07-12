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
      const minX = Math.max(0, viewportPositionX);
      const minY = Math.max(0, viewportPositionY);

      const maxX = Math.min(viewportPositionX + viewportSizeX, sceneSizeX);
      const maxY = Math.min(viewportPositionY + viewportSizeY, sceneSizeY);

      var xRange = range(minX, maxX);
      var yRange = range(minY, maxY);

      return cross(xRange, yRange, (x, y) => indexOfTileAt(sceneSizeY, x, y));
    }
  );
}
