import { reaction } from "mobx"
import { inject } from "mobx-react"
import { Component } from "react"
import { get, each } from "lodash"

export default inject(({ state, computations, actions }, { scenePath }) => ({
  scene: get(state, scenePath),
  computations,
  actions
}))(
  class PlayerCharacterMovementListener extends Component {
    componentDidMount() {
      this.createReaction()
    }

    componentWillUnmount() {
      this.disposeReaction()
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.scenePath !== nextProps.scenePath) {
        this.disposeReaction()
        this.createReaction()
      }
    }

    createReaction() {
      this.disposeReaction = reaction(
        () =>
          this.props.computations.computeWatchedSceneTiles(this.props.scene),
        watchedTiles => {
          each(watchedTiles, (val, tileId) => {
            const tile = this.props.scene.tiles[tileId]
            this.props.actions.setTileDiscovered(tile, true)
          })
        },
        { fireImmediately: true }
      )
    }

    render() {
      return null
    }
  }
)
