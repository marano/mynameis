import { Component } from "react"
import { inject } from "mobx-react"

import keydownStream from "../streams/keydown"
import createMoveKeydownStream from "../streams/moveKeydown"
import createKeydownEventHandler from "../event-handlers/keydown"
import createMoveKeydownEventHandler, {
  movementKeys
} from "../event-handlers/moveKeydown"

export default inject("state", "actions")(
  class GlobalListeners extends Component {
    componentDidMount() {
      this.keydownSubscription = keydownStream.subscribe(
        createKeydownEventHandler(this.props.actions)
      )

      this.moveKeydownSubscription = createMoveKeydownStream(
        movementKeys
      ).subscribe(
        createMoveKeydownEventHandler(this.props.state, this.props.actions)
      )
    }

    componentWillUnmount() {
      this.keydownSubscription.unsubscribe()
      this.moveKeydownSubscription.unsubscribe()
    }

    render() {
      return null
    }
  }
)
