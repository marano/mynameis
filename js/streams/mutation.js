import { reaction } from "mobx"
import { Subject } from "rxjs"

export default function createOnMutationStream(state) {
  var observable = new Subject()
  const dispose = reaction(
    () => JSON.stringify(state),
    json => observable.next(json),
    { delay: 3000 }
  )
  return observable.finally(dispose)
}
