import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'cerebral/inferno';
import { state, signal } from 'cerebral/tags';
import { assign } from 'lodash';

import onWindowResize from '../on-window-resize';

import WorldTile from './WorldTile';

class Viewport extends Component {
  constructor(props) {
    super(props);
    this.setViewportRef = this.setViewportRef.bind(this);
  }

  componentDidMount() {
    this.callViewportResized();
    onWindowResize('viewport', this.callViewportResized.bind(this));
  }

  componentWillUnmount() {
    onWindowResize('viewport', null);
  }

  callViewportResized() {
    const viewportWidth = this.viewportRef.offsetWidth;
    const viewportHeight = this.viewportRef.offsetHeight;
    this.props.viewportResized({ viewportWidth, viewportHeight });
  }

  render() {
    return (
      <viewport ref={this.setViewportRef} style={this.outerStyle()}>
        <viewport-window style={this.windowStyle()}>
          <viewport-content style={this.contentStyle()}>
            {this.props.tilesIndexes.map((tileIndex) => <WorldTile key={tileIndex} tileIndex={tileIndex} />)}
          </viewport-content>
        </viewport-window>
      </viewport>
    );
  }

  setViewportRef(viewportRef) {
    this.viewportRef = viewportRef;
  }

  outerStyle() {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    };
  }

  windowStyle() {
    return {
      position: 'relative',
      overflow: 'hidden',
      width: this.props.viewportSize.x * this.props.tileSize,
      height: this.props.viewportSize.y * this.props.tileSize
    };
  }

  contentStyle() {
    return {
      position: 'absolute',
      width: this.props.worldSize.x * this.props.tileSize,
      height: this.props.worldSize.y * this.props.tileSize,
      left: -(this.props.viewportPosition.x * this.props.tileSize),
      top: -(this.props.viewportPosition.y * this.props.tileSize)
    };
  }
}

export default connect({
  tilesIndexes: state`viewport.visibleTilesIndexes`,
  tileSize: state`viewport.tileSize`,
  viewportSize: state`viewport.size`,
  viewportPosition: state`viewport.position`,
  worldSize: state`world.size`,
  viewportResized: signal`viewportResized`
}, Viewport);
