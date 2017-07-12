import Inferno from 'inferno';
import { connect } from 'cerebral/inferno';
import { state } from 'cerebral/tags';

import Viewport from './Viewport';
import SideMenu from './SideMenu';

function Main({ sideMenuWidth }) {
  return (
    <main style={containerStyle()}>
      <div style={viewportStyle()}>
        <Viewport sceneDataPath="scene" />
      </div>
      <div style={sideMenuStyle()}>
        <SideMenu />
      </div>
    </main>
  );

  function containerStyle() {
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
      padding: 20
    };
  }
}

export default connect({
  sideMenuWidth: state`sideMenu.width`
}, Main);
