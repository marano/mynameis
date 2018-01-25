import { Observable } from "rxjs"

export default Observable.fromEvent(window, "resize").throttleTime(50)
