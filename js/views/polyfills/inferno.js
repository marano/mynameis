export function linkEvent(data, callback) {
  return function(event) {
    callback(data, event)
  }
}
