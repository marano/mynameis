import { Component } from "react"
import { inject } from "mobx-react"
import { css } from "emotion"
import hasKeyedChildren from "has-keyed-children"
import { get } from "lodash"

import windowResize$ from "../streams/windowResize"

import SceneTile from "./SceneTile"

function viewportClassName(tileSize) {
  return css`
    --tile-size: ${tileSize}px;
  `
}

export default inject(({ store }, { scenePath }) => ({
  tileIds: get(store, `${scenePath}.viewport.visibleTileIds`).slice(),
  tileSize: get(store, `${scenePath}.viewport.tileSize`),
  viewportSizeX: get(store, `${scenePath}.viewport.size.x`),
  viewportSizeY: get(store, `${scenePath}.viewport.size.y`),
  viewportPositionX: get(store, `${scenePath}.viewport.position.x`),
  viewportPositionY: get(store, `${scenePath}.viewport.position.y`),
  worldSizeX: get(store, `${scenePath}.size.x`),
  worldSizeY: get(store, `${scenePath}.size.y`),
  currentMode: get(store, `${scenePath}.currentMode`)
}))(
  class Viewport extends Component {
    constructor(props) {
      super(props)
      this.callViewportResized = this.callViewportResized.bind(this)
      this.setViewportRef = this.setViewportRef.bind(this)
    }

    componentDidMount() {
      // this.onWindowResizeSubscription = windowResize$.subscribe(
      // this.callViewportResized
      // )
      // setImmediate(this.callViewportResized)
    }

    componentWillUnmount() {
      // this.onWindowResizeSubscription.unsubscribe()
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
        width: this.props.viewportSizeX * this.props.tileSize,
        height: this.props.viewportSizeY * this.props.tileSize,
        border: "2px solid white"
      }
    }

    contentStyle() {
      const borderWidth = 2
      const x =
        -(this.props.viewportPositionX * this.props.tileSize) - borderWidth
      const y =
        -(this.props.viewportPositionY * this.props.tileSize) - borderWidth
      const delay = this.props.currentMode === "game" ? 350 : 0
      return {
        width: this.props.worldSizeX * this.props.tileSize,
        height: this.props.worldSizeY * this.props.tileSize,
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
