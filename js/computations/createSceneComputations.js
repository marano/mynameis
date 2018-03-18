import { sortBy, assign, each } from "lodash"

export default function createSceneComputations(state, computations) {
  return {
    computeSortedTileIds(scene) {
      const totalTiles = scene.size.x * scene.size.y // Workaround to trigger computation when the scene size changes
      return totalTiles && sortBy(scene.tiles, ["x", "y"]).map(({ id }) => id)
    },
    computeWatchedSceneTiles(scene) {
      const result = {}
      each(scene.playerCharacterWorldObjectIds.slice(), worldObjectId => {
        const worldObject = scene.worldObjects[worldObjectId]
        const fieldOfVision = computations.computeFieldOfVision(worldObject)
        assign(result, fieldOfVision)
      })
      return result
    }
  }
}
