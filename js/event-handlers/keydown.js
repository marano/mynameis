import { compose, contains, keys } from "ramda"
import { keyHandlers } from "../actions"

export default function createKeydownHandler(controller) {
  return function handleKeydown({ key }) {
    if (compose(contains(key), keys)(keyHandlers)) {
      const scenePath = controller.getState(`viewport.currentScenePath`)
      controller.getSignal("keyPressed")({ scenePath, key })
    }
  }
}
