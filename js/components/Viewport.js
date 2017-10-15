import { props, state, signal } from 'cerebral/tags';
import  { css } from 'emotion';

import onWindowResize from '../on-window-resize';

import { computeVisibleTileIndexes } from '../computes';

import SceneTile from './SceneTile';

const viewportClassName = props => css`
  --tile-size: ${props.tileSize}px;
`;

const windowClassName = props => css`
  position: relative;
  overflow: hidden;
  width: ${props.viewportSize.x * props.tileSize}px;
  height: ${props.viewportSize.y * props.tileSize}px;
  border: 2px solid white;
`

const contentClassName = props => css`
  position: absolute;
  width: ${props.worldSize.x * props.tileSize}px;
  height: ${props.worldSize.y * props.tileSize}px;
  left: ${-(props.viewportPosition.x * props.tileSize) - 2}px;
  top: ${-(props.viewportPosition.y * props.tileSize) - 2}px;
  border: 2px solid white;
`;

const outerClassName = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
`

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
        <div
          className={`${viewportClassName(this.props)} ${outerClassName}`}
          ref={this.setViewportRef}
        >
          <div className={windowClassName(this.props)}>
            <div className={contentClassName(this.props)} hasKeyedChildren>
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

    contentStyle() {
      const borderWidth = 2;
      return {
        position: 'absolute',
        width: this.props.worldSize.x * this.props.tileSize,
        height: this.props.worldSize.y * this.props.tileSize,
        left: -(this.props.viewportPosition.x * this.props.tileSize) - borderWidth,
        top: -(this.props.viewportPosition.y * this.props.tileSize) - borderWidth,
        borderWidth,
        borderStyle: 'solid',
        borderColor: 'white'
      };
    }
  }
);
