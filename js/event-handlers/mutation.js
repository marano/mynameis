import { localStorageStateKey } from "../constants"

export default function createOnMutationEventHandler() {
  return state => {
    const data = JSON.stringify(state)
    window.requestIdleCallback(() =>
      window.localStorage.setItem(localStorageStateKey, data)
    )
  }
}
