import { create, event } from "most-subject"
import { runEffects, tap } from "@most/core"
import { newDefaultScheduler, currentTime } from "@most/scheduler"

const scheduler = newDefaultScheduler()

const [sink, stream] = create(tap(console.log))

runEffects(stream, scheduler)

export const mouseMoved = data => event(currentTime(scheduler), data, sink)
