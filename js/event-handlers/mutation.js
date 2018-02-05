import { localStorageStateKey } from "../constants"

export default function createOnMutationEventHandler() {
  return state =>
    window.localStorage.setItem(localStorageStateKey, JSON.stringify(state))
}
