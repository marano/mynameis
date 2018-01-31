import { observable } from "mobx"

export default function createStore(initialState) {
  return observable(initialState)
}
