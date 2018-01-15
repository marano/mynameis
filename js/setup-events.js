import { Observable } from "rxjs/Rx"
import { compose, contains, keys, reduce } from "ramda"
import { keyHandlers } from "./actions"

export default function setupEvents(controller) {
  window.addEventListener(
    "keydown",
    function({ key }) {
      const mode = controller.getState("currentMode")
      const scenePath = controller.getState(`modes.${mode}.currentScenePath`)

      if (compose(contains(key), keys)(keyHandlers)) {
        controller.getSignal("keyPressed")({ scenePath, key })
      }
    },
    true
  )

  const movementKeys = {
    w: { deltaX: 0, deltaY: -1 },
    s: { deltaX: 0, deltaY: +1 },
    a: { deltaX: -1, deltaY: 0 },
    d: { deltaX: +1, deltaY: 0 }
  }
  const pressedKeys = []

  const emitter = Observable.interval(100).startWith(0)
  let emitterSubscription

  Observable.fromEvent(document, "keydown")
    .merge(Observable.fromEvent(document, "keyup"))
    .filter(event => contains(event.key.toLowerCase(), keys(movementKeys)))
    .groupBy(e => e.key.toLowerCase())
    .map(group => group.distinctUntilChanged(null, e => e.type))
    .mergeAll()
    .subscribe(event => {
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
    })

  function moveViewport() {
    const mode = controller.getState("currentMode")
    const scenePath = controller.getState(`modes.${mode}.currentScenePath`)

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
