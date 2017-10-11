export default function linkEvent(args, callback) {
  return function (event) {
    return callback(args)
  }
}
