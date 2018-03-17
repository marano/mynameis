import { localStorageStateKey } from "../constants"

export default function createOnMutationEventHandler() {
  return data =>
    window.requestIdleCallback(() =>
      window.localStorage.setItem(localStorageStateKey, data)
    )
}
