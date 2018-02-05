import { compose, contains, keys } from "ramda"
import { keyHandlers } from "../actions/createEventActions"

export default function createKeydownHandler(actions) {
  return function handleKeydown({ key }) {
    if (compose(contains(key), keys)(keyHandlers)) {
      actions.keyPressed(key)
    }
  }
}
