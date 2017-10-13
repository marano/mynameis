export default function linkEvent(data, callback) {
  return function(event) {
    callback(data)
  }
}
