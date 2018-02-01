import { autorunAsync, toJS } from "mobx"
import { Subject } from "rxjs"

export default function createOnMutationStream(store) {
  var observable = new Subject()
  const dispose = autorunAsync(() => observable.next(toJS(store)), 1000)
  return observable.finally(dispose)
}
