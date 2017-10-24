import { throttle, each } from "lodash"

const callbacks = {}

const onWindowResize = throttle(
  function() {
    each(callbacks, function(callback, key) {
      if (callback) {
        callback()
      }
    })
  },
  50,
  { leading: false, trailing: true }
)

window.addEventListener("resize", onWindowResize, true)

export default function(key, callback) {
  callbacks[key] = callback
}
