export default function createTileActions(state, computations, actions) {
  return {
    setTileDiscovered(tile, isDiscovered) {
      tile.isDiscovered = isDiscovered
    }
  }
}
