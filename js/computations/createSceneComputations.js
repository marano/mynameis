import { sortBy } from "lodash"

export default function createSceneComputations(state) {
  return {
    computeSortedTileIds(scene) {
      const totalTiles = scene.size.x * scene.size.y // Workaround to trigger computation when the scene size changes
      return totalTiles && sortBy(scene.tiles, ["x", "y"]).map(({ id }) => id)
    }
  }
}
