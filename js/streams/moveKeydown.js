import { Observable } from "rxjs/Rx"
import { contains, keys } from "ramda"

export default function createMovementKeydownStream(movementKeys) {
  return Observable.fromEvent(document, "keydown")
    .merge(Observable.fromEvent(document, "keyup"))
    .filter(event => contains(event.key.toLowerCase(), keys(movementKeys)))
    .groupBy(e => e.key.toLowerCase())
    .map(group => group.distinctUntilChanged(null, e => e.type))
    .mergeAll()
}
