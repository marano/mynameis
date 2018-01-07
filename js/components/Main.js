import { state } from "cerebral/tags"

import TopMenu from "./TopMenu"
import Viewport from "./Viewport"
import SideMenu from "./SideMenu"

class Main extends Component {
  getChildContext() {
    return this.props.context
  }

  render() {
    const { currentScenePath, sideMenuWidth } = this.props

    return (
      <div style={containerStyle(sideMenuWidth)}>
        <div style={topMenuStyle()}>
          <TopMenu scenePath={currentScenePath} />
        </div>
        <div style={viewportStyle()}>
          <Viewport scenePath={currentScenePath} />
        </div>
        <div style={sideMenuStyle()}>
          <SideMenu scenePath={currentScenePath} />
        </div>
      </div>
    )
  }
}

export default connect(
  {
    currentScenePath: state`modes.${state`currentMode`}.currentScenePath`,
    sideMenuWidth: state`sideMenu.width`
  },
  Main
)

function containerStyle(sideMenuWidth) {
  return {
    display: "grid",
    width: "100%",
    height: "100%",
    gridTemplateRows: "42px calc(100% - 42px)",
    gridTemplateColumns: `auto ${sideMenuWidth}px`
  }
}

function topMenuStyle() {
  return {
    gridRow: "1",
    gridColumn: "1 / span 2",
    backgroundColor: "black"
  }
}

function viewportStyle() {
  return {
    gridRow: "2",
    gridColumn: "1",
    overflow: "hidden",
    padding: "15px 0px 15px 0px",
    backgroundColor: "black"
  }
}

function sideMenuStyle() {
  return {
    gridRow: "2",
    gridColumn: "2",
    backgroundColor: "black",
    overflow: "auto",
    padding: 10
  }
}
