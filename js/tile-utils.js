export function idOfTileAt(sortedTileIds, sceneSizeY, x, y) {
  return sortedTileIds[indexOfTileAt(sceneSizeY, x, y)]
}

function indexOfTileAt(sceneSizeY, x, y) {
  return x * sceneSizeY + y
}
