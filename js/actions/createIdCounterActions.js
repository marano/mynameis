import { get, set } from "lodash"

export default function createIdCounterActions(state) {
  return {
    generateId(model) {
      const counterPath = `idCounters.${model}`
      const id = get(state, counterPath, 0) + 1
      set(state, counterPath, id)
      return id
    }
  }
}
