export default function createOnMutationEventHandler(cerebralStateKey) {
  return state =>
    window.localStorage.setItem(cerebralStateKey, JSON.stringify(state))
}
