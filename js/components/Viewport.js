import Component from 'inferno-component';
import { connect } from 'cerebral/inferno';
import { props, state, signal } from 'cerebral/tags';

import onWindowResize from '../on-window-resize';

import { computeVisibleTileIndexes } from '../computes';

import SceneTile from './SceneTile';

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
    const { sceneDataPath } = this.props;
    const viewportWidth = this.viewportRef.offsetWidth;
    const viewportHeight = this.viewportRef.offsetHeight;
    this.props.viewportResized({ sceneDataPath, viewportWidth, viewportHeight });
  }

  render() {
    return (
      <viewport ref={this.setViewportRef} style={this.outerStyle()}>
        <viewport-window style={this.windowStyle()}>
          <viewport-content style={this.contentStyle()} hasKeyedChildren>
            {
              this
                .props
                .tilesIndexes
                .map(
                  (tileIndex) => {
                    return (
                      <SceneTile
                        sceneDataPath={this.props.sceneDataPath}
                        key={tileIndex}
                        tileIndex={tileIndex}
                      />
                    );
                  }
                )
            }
          </viewport-content>
        </viewport-window>
      </viewport>
    );
  }

  setViewportRef(viewportRef) {
    this.viewportRef = viewportRef;
  }

  outerStyle() {
    return `
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: black;
      --tile-size: ${this.props.tileSize}px;
    `;
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
  tilesIndexes: computeVisibleTileIndexes(props`sceneDataPath`),
  tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
  viewportSize: state`${props`sceneDataPath`}.viewport.size`,
  viewportPosition: state`${props`sceneDataPath`}.viewport.position`,
  worldSize: state`${props`sceneDataPath`}.size`,
  viewportResized: signal`viewportResized`
}, Viewport);
