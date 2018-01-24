import { Observable } from "rxjs/Rx"
import { reduce } from "ramda"

const pressedKeys = []

const emitter = Observable.interval(100).startWith(0)
let emitterSubscription

export const movementKeys = {
  w: { deltaX: 0, deltaY: -1 },
  s: { deltaX: 0, deltaY: +1 },
  a: { deltaX: -1, deltaY: 0 },
  d: { deltaX: +1, deltaY: 0 }
}

export default function createMoveKeydownHandler(controller) {
  return function handleMoveKeydown(event) {
    const key = event.key.toLowerCase()
    switch (event.type) {
      case "keydown":
        pressedKeys.push(key)
        if (pressedKeys.length === 1) {
          emitterSubscription = emitter.subscribe(moveViewport)
        }
        break
      case "keyup":
        pressedKeys.splice(pressedKeys.indexOf(key), 1)
        if (pressedKeys.length === 0) {
          emitterSubscription.unsubscribe()
        }
        break
    }
  }

  function moveViewport() {
    const scenePath = controller.getState(`viewport.currentScenePath`)
    if (!scenePath) {
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

    controller.getSignal("viewportMoved")({
      scenePath,
      ...deltas
    })
  }
}
