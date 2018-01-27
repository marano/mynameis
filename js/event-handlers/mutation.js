import { cerebralStateKey } from "../constants"

export default function createOnMutationEventHandler() {
  return state =>
    window.localStorage.setItem(cerebralStateKey, JSON.stringify(state))
}
