import { props, state, signal } from 'cerebral/tags';

import onWindowResize from '../on-window-resize';

import { computeVisibleTileIndexes } from '../computes';

import SceneTile from './SceneTile';

export default connect(
  {
    tilesIndexes: computeVisibleTileIndexes(props`sceneDataPath`),
    tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
    viewportSize: state`${props`sceneDataPath`}.viewport.size`,
    viewportPosition: state`${props`sceneDataPath`}.viewport.position`,
    worldSize: state`${props`sceneDataPath`}.size`,
    viewportResized: signal`viewportResized`
  },
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
        <div className="viewport" ref={this.setViewportRef} style={this.outerStyle()}>
          <style jsx>{`
            .viewport {
              --tile-size: ${this.props.tileSize}px;
            }
          `}</style>

          <div style={this.windowStyle()}>
            <div style={this.contentStyle()} hasKeyedChildren>
              {
                this
                  .props
                  .tilesIndexes
                  .map((tileIndex) => (
                    <SceneTile
                      sceneDataPath={this.props.sceneDataPath}
                      key={tileIndex}
                      tileIndex={tileIndex}
                    />
                  ))
              }
            </div>
          </div>
        </div>
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
        height: this.props.viewportSize.y * this.props.tileSize,
        border: '2px solid white'
      };
    }

    contentStyle() {
      const borderWidth = 2;
      const x = -(this.props.viewportPosition.x * this.props.tileSize) - borderWidth;
      const y = -(this.props.viewportPosition.y * this.props.tileSize) - borderWidth;
      return {
        width: this.props.worldSize.x * this.props.tileSize,
        height: this.props.worldSize.y * this.props.tileSize,
        transform: `translate(${x}px, ${y}px)`,
        willChange: 'transform',
        transition: 'transform 350ms',
        borderWidth,
        borderStyle: 'solid',
        borderColor: 'white'
      };
    }
  }
);
