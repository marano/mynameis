import { state } from "cerebral/tags"

import TopMenu from "./TopMenu"
import Viewport from "./Viewport"
import SideMenu from "./SideMenu"

export default connect(
  {
    currentSceneDataPath: state`currentSceneDataPath`,
    sideMenuWidth: state`sideMenu.width`
  },
  Main
)

function Main({ currentSceneDataPath, sideMenuWidth }) {
  return (
    <main style={containerStyle(sideMenuWidth)}>
      <div style={topMenuStyle()}>
        <TopMenu />
      </div>
      <div style={viewportStyle()}>
        <Viewport sceneDataPath={currentSceneDataPath} />
      </div>
      <div style={sideMenuStyle()}>
        <SideMenu />
      </div>
    </main>
  )
}

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
    padding: 10,
    overflow: "scroll"
  }
}
