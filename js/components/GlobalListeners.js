import { Component } from "react"

import keydownStream from "../streams/keydown"
import createMoveKeydownStream from "../streams/moveKeydown"
import createKeydownEventHandler from "../event-handlers/keydown"
import createMoveKeydownEventHandler, {
  movementKeys
} from "../event-handlers/moveKeydown"
import createOnMutationStream from "../streams/mutation"
import createOnMutationEventHandler from "../event-handlers/mutation"

export default class GlobalListeners extends Component {
  componentDidMount() {
    this.keydownSubscription = keydownStream.subscribe(
      createKeydownEventHandler(this.props.controller)
    )

    this.moveKeydownSubscription = createMoveKeydownStream(
      movementKeys
    ).subscribe(createMoveKeydownEventHandler(this.props.controller))

    this.mutationSubscription = createOnMutationStream(
      this.props.controller
    ).subscribe(createOnMutationEventHandler())
  }

  componentWillUnmount() {
    this.keydownSubscription.unsubscribe()
    this.moveKeydownSubscription.unsubscribe()
    this.mutationSubscription.unsubscribe()
  }

  render() {
    return null
  }
}
