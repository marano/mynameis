import { inject } from "mobx-react"

import GlobalListeners from "./GlobalListeners"
import TopMenu from "./TopMenu"
import Viewport from "./Viewport"
import SideMenu from "./SideMenu"

export default inject(({ store }) => ({
  currentScenePath: store.viewport.currentScenePath
}))(Main)

function Main({ currentScenePath }) {
  return (
    <div style={containerStyle()}>
      <GlobalListeners />
      <div style={topMenuStyle()}>
        {/* <TopMenu scenePath={currentScenePath} /> */}
      </div>
      <div style={viewportStyle()}>
        {currentScenePath && <Viewport scenePath={currentScenePath} />}
      </div>
      <div style={sideMenuStyle()}>
        {/* <SideMenu scenePath={currentScenePath} /> */}
      </div>
    </div>
  )
}

function containerStyle(sideMenuWidth) {
  return {
    display: "grid",
    width: "100%",
    height: "100%",
    gridTemplateRows: "42px calc(100% - 42px)",
    gridTemplateColumns: `auto 300px`
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
