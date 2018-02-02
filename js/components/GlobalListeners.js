import { Component } from "react"
import { inject } from "mobx-react"

import keydownStream from "../streams/keydown"
import createMoveKeydownStream from "../streams/moveKeydown"
import createKeydownEventHandler from "../event-handlers/keydown"
import createMoveKeydownEventHandler, {
  movementKeys
} from "../event-handlers/moveKeydown"

export default inject("store", "actions")(
  class GlobalListeners extends Component {
    componentDidMount() {
      // this.keydownSubscription = keydownStream.subscribe(
      // createKeydownEventHandler(this.props.controller)
      // )

      this.moveKeydownSubscription = createMoveKeydownStream(
        movementKeys
      ).subscribe(
        createMoveKeydownEventHandler(this.props.store, this.props.actions)
      )
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
)
