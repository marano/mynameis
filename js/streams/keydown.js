import { Observable } from "rxjs/Rx"

export default Observable.fromEvent(document, "keydown")
