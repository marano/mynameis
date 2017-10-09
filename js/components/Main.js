import { connect } from '@cerebral/inferno';
import { state } from 'cerebral/tags';

import Viewport from './Viewport';
import SideMenu from './SideMenu';

export default connect({
  currentSceneDataPath: state`currentSceneDataPath`,
  sideMenuWidth: state`sideMenu.width`
}, Main);

function Main({ currentSceneDataPath, sideMenuWidth }) {
  return (
    <main style={containerStyle(sideMenuWidth)}>
      <div style={viewportStyle()}>
        <Viewport sceneDataPath={currentSceneDataPath} />
      </div>
      <div style={sideMenuStyle()}>
        <SideMenu />
      </div>
    </main>
  );
}

function containerStyle(sideMenuWidth) {
  return {
    display: 'grid',
    width: '100%',
    height: '100%',
    gridTemplateRows: '100%',
    gridTemplateColumns: `auto ${sideMenuWidth}px`
  };
}

function viewportStyle() {
  return {
    gridRow: '1',
    gridColumn: '1',
    overflow: 'hidden'
  };
}

function sideMenuStyle() {
  return {
    gridRow: '1',
    gridColumn: '2',
    backgroundColor: 'black',
    padding: 10,
    overflow: 'scroll'
  };
}
