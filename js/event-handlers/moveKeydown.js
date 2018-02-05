import { Observable } from "rxjs/Rx"
import { reduce } from "ramda"

let pressedKeys
const emitter = Observable.interval(100).startWith(0)
let emitterSubscription

export const movementKeys = {
  w: { deltaX: 0, deltaY: -1 },
  s: { deltaX: 0, deltaY: +1 },
  a: { deltaX: -1, deltaY: 0 },
  d: { deltaX: +1, deltaY: 0 }
}

export default function createMoveKeydownHandler(store, actions) {
  return function handleMoveKeydown(newPressedKeys) {
    pressedKeys = newPressedKeys
    if (pressedKeys.length === 0) {
      emitterSubscription.unsubscribe()
      emitterSubscription = null
    } else if (pressedKeys.length === 1 && !emitterSubscription) {
      emitterSubscription = emitter.subscribe(moveViewport)
    }
  }

  function moveViewport() {
    if (!store.viewport.currentScenePath) {
      return
    }
    const deltas = reduce(
      (deltas, pressedKey) => {
        deltas.deltaX = deltas.deltaX + movementKeys[pressedKey].deltaX
        deltas.deltaY = deltas.deltaY + movementKeys[pressedKey].deltaY
        return deltas
      },
      { deltaX: 0, deltaY: 0 },
      pressedKeys
    )

    actions.viewportMoved(store.viewport, deltas.deltaX, deltas.deltaY)
  }
}
