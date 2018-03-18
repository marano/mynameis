import { reaction } from "mobx"
import { inject } from "mobx-react"
import { Component } from "react"
import { get, each } from "lodash"

export default inject("state", "actions", "computations")(
  class PlayerCharacterMovementListener extends Component {
    componentDidMount() {
      const scene = get(this.props.state, this.props.scenePath)
      this.reaction = reaction(
        () => this.props.computations.computeWatchedSceneTiles(scene),
        watchedTiles => {
          each(watchedTiles, (val, tileId) => {
            const tile = scene.tiles[tileId]
            this.props.actions.setTileDiscovered(tile, true)
          })
        },
        { fireImmediately: true }
      )
    }

    componentWillUnmount() {
      this.reaction.dispose()
    }

    render() {
      return null
    }
  }
)
