import { Component } from "react"
import { props, state, signal } from "cerebral/tags"
import { css } from "emotion"
import { branch, compose, renderNothing } from "recompose"
import connect from "../curried-connect"
import hasKeyedChildren from "has-keyed-children"

import onWindowResize from "../on-window-resize"

import SceneTile from "./SceneTile"

function viewportClassName(tileSize) {
  return css`
    --tile-size: ${tileSize}px;
  `
}

export default compose(
  branch(({ scenePath }) => !scenePath, renderNothing),
  connect({
    tileIds: state`${props`scenePath`}.viewport.visibleTileIds`,
    tileSize: state`${props`scenePath`}.viewport.tileSize`,
    viewportSize: state`${props`scenePath`}.viewport.size`,
    viewportPosition: state`${props`scenePath`}.viewport.position`,
    currentMode: state`${props`scenePath`}.currentMode`,
    worldSize: state`${props`scenePath`}.size`,
    viewportResized: signal`viewportResized`
  })
)(
  class Viewport extends Component {
    constructor(props) {
      super(props)
      this.callViewportResized = this.callViewportResized.bind(this)
      this.setViewportRef = this.setViewportRef.bind(this)
    }

    componentDidMount() {
      this.onWindowResizeSubscription = onWindowResize.subscribe(
        this.callViewportResized
      )
      setImmediate(this.callViewportResized)
    }

    componentWillUnmount() {
      this.onWindowResizeSubscription.unsubscribe()
    }

    callViewportResized() {
      const { scenePath } = this.props
      const viewportWidth = this.viewportRef.offsetWidth
      const viewportHeight = this.viewportRef.offsetHeight
      this.props.viewportResized({
        scenePath,
        viewportWidth,
        viewportHeight
      })
    }

    render() {
      return (
        <div
          className={viewportClassName(this.props.tileSize)}
          ref={this.setViewportRef}
          style={this.outerStyle()}
        >
          <div style={this.windowStyle()}>
            <div style={this.contentStyle()} {...hasKeyedChildren}>
              {this.props.tileIds.map(tileId => (
                <SceneTile
                  scenePath={this.props.scenePath}
                  key={tileId}
                  tileId={tileId}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    setViewportRef(viewportRef) {
      this.viewportRef = viewportRef
    }

    outerStyle() {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black"
      }
    }

    windowStyle() {
      return {
        overflow: "hidden",
        width: this.props.viewportSize.x * this.props.tileSize,
        height: this.props.viewportSize.y * this.props.tileSize,
        border: "2px solid white"
      }
    }

    contentStyle() {
      const borderWidth = 2
      const x =
        -(this.props.viewportPosition.x * this.props.tileSize) - borderWidth
      const y =
        -(this.props.viewportPosition.y * this.props.tileSize) - borderWidth
      const delay = this.props.currentMode === "game" ? 350 : 0
      return {
        width: this.props.worldSize.x * this.props.tileSize,
        height: this.props.worldSize.y * this.props.tileSize,
        transform: `translate(${x}px, ${y}px)`,
        willChange: "transform",
        transition: `transform ${delay}ms`,
        borderWidth,
        borderStyle: "solid",
        borderColor: "white"
      }
    }
  }
)
