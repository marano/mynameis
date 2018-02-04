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

export default inject(
  (
    {
      state,
      computations: { computeViewportSize, computeVisibleTileIds },
      actions
    },
    { viewport, viewport: { currentScenePath } }
  ) => {
    const scene = get(state, currentScenePath)
    return {
      scenePath: viewport.currentScenePath,
      tileSize: scene.viewport.tileSize,
      viewportPositionX: scene.viewport.position.x,
      viewportPositionY: scene.viewport.position.y,
      worldSizeX: scene.size.x,
      worldSizeY: scene.size.y,
      currentMode: scene.currentMode,
      viewportSize: computeViewportSize(viewport),
      tileIds: computeVisibleTileIds(viewport),
      actions
    }
  }
)(
  class Viewport extends Component {
    constructor(props) {
      super(props)
      this.callViewportResized = this.callViewportResized.bind(this)
      this.setViewportRef = this.setViewportRef.bind(this)
    }

    componentDidMount() {
      this.onWindowResizeSubscription = windowResize$.subscribe(
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
      this.props.actions.viewportResized(
        scenePath,
        viewportWidth,
        viewportHeight
      )
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
