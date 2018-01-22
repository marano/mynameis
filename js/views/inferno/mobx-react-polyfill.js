import { connect } from "inferno-mobx"
export { Provider } from "inferno-mobx"

export function inject(mapStateToProps) {
  return connect([mapStateToProps])
}
