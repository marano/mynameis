import { Subject } from "rxjs"

export default function createOnMutationStream(controller) {
  var observable = new Subject()
  controller.on("mutation", () => observable.next(controller.getState()))
  return observable.auditTime(1000)
}
