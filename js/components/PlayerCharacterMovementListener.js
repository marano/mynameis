import { reaction } from "mobx"
import { inject } from "mobx-react"
import { Component } from "react"
import { get, each, noop } from "lodash"

export default inject(({ state, computations, actions }, { scenePath }) => {
  const scene = get(state, scenePath)
  return {
    scene,
    mode: scene && scene.currentMode,
    computations,
    actions
  }
})(
  class PlayerCharacterMovementListener extends Component {
    componentDidMount() {
      this.createReaction()
    }

    componentWillUnmount() {
      this.disposeReaction()
    }

    componentDidUpdate(prevProps) {
      if (this.props.scenePath !== prevProps.scenePath) {
        this.disposeReaction()
        this.createReaction()
      }
    }

    createReaction() {
      if (this.props.mode === "game") {
        this.disposeReaction = reaction(
          () =>
            this.props.computations.computeWatchedSceneTiles(this.props.scene),
          watchedTiles => {
            each(watchedTiles, (val, tileId) => {
              const tile = this.props.scene.tiles[tileId]
              if (!tile.isDiscovered) {
                this.props.actions.setTileDiscovered(tile, true)
              }
            })
          },
          { fireImmediately: true }
        )
      } else {
        this.disposeReaction = noop
      }
    }

    render() {
      return null
    }
  }
)
