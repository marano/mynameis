import Rx from "rxjs/Rx"
import includes from "lodash/includes"

export default function setupEvents(controller) {
  const keyDowns = Rx.Observable.fromEvent(document, "keydown")
  const keyUps = Rx.Observable.fromEvent(document, "keyup")

  const keyActions = keyDowns
    .merge(keyUps)
    .filter(event => includes(["a", "w", "s", "d"], event.key.toLowerCase()))
    .groupBy(e => e.key.toLowerCase())
    .map(group => group.distinctUntilChanged(null, e => e.type))
    .mergeAll()

  const keyEmiters = {}

  keyActions.subscribe(event => {
    const key = event.key
    if (keyEmiters[key]) {
      keyEmiters[key].unsubscribe()
      keyEmiters[key] = null
    } else {
      keyEmiters[key] = Rx.Observable.interval(50).subscribe(() => {
        const mode = controller.getState("currentMode")
        const scenePath = controller.getState(`modes.${mode}.currentScenePath`)

        controller.getSignal("keyPressed")({
          scenePath,
          key: event.key.toLowerCase()
        })
      })
    }
  })
}
