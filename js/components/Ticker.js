import { Component } from "react"
import { inject } from "mobx-react"

import { each } from "lodash"

const tickInterval = 100

export default inject("state", "actions")(
  class Ticker extends Component {
    componentDidMount() {
      this.interval = setInterval(() => {
        each(this.props.state.scenes, scene => {
          each(scene.tickables, (tickable, tickableIndex) => {
            tickable.progress += tickInterval
            const step = tickable.steps[0]
            if (tickable.progress >= step.cost) {
              tickable.progress -= step.cost
              switch (step.type) {
                case "moveTo":
                  this.props.actions.worldObjectMoved(
                    step.subject,
                    step.targetTile
                  )
                  break
              }
              tickable.steps.splice(0, 1)
            }
            if (tickable.steps.length === 0) {
              scene.tickables.splice(tickableIndex, 1)
            }
          })
        })
      }, tickInterval)
    }

    componentWillUnmount() {
      clearInterval(this.interval)
    }

    render() {
      return null
    }
  }
)
