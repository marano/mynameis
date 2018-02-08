import { autorunAsync } from "mobx"
import { Subject } from "rxjs"

export default function createOnMutationStream(state) {
  var observable = new Subject()
  const dispose = autorunAsync(() => observable.next(state), 1000)
  return observable.finally(dispose)
}
