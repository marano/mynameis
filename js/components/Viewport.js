import Component from 'inferno-component';
import { connect } from 'cerebral/inferno';
import { props, state, signal } from 'cerebral/tags';
import { isEqual, throttle } from 'lodash';

import onWindowResize from '../on-window-resize';

import { computeVisibleTileIndexes } from '../computes';

import Dragdealer from './Dragdealer';
import SceneTile from './SceneTile';

export default connect(
  {
    tilesIndexes: computeVisibleTileIndexes(props`sceneDataPath`),
    tileSize: state`${props`sceneDataPath`}.viewport.tileSize`,
    viewportSize: state`${props`sceneDataPath`}.viewport.size`,
    viewportPosition: state`${props`sceneDataPath`}.viewport.position`,
    sceneSize: state`${props`sceneDataPath`}.size`,
    viewportResized: signal`viewportResized`,
    viewportPositionUpdated: signal`viewportPositionUpdated`
  },
  class Viewport extends Component {
    constructor(props) {
      super(props);
      this.setViewportRef = this.setViewportRef.bind(this);
      this.dragdealerAnimationCallback = throttle(
        this.dragdealerAnimationCallback.bind(this),
        150,
        { leading: false, trailing: true }
      );
    }

    componentDidMount() {
      this.callViewportResized();
      onWindowResize('viewport', this.callViewportResized.bind(this));
    }

    componentWillUnmount() {
      onWindowResize('viewport', null);
    }

    render() {
      return (
        <viewport ref={this.setViewportRef} style={this.outerStyle()}>
          <Dragdealer
            options={this.dragdealerOptions()}
            wrapperStyle={this.windowStyle()}
            handleStyle={this.contentStyle()}
            hasKeyedChildren
          >
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
          </Dragdealer>
        </viewport>
      );
    }

    callViewportResized() {
      const { sceneDataPath } = this.props;
      const viewportWidth = this.viewportRef.offsetWidth;
      const viewportHeight = this.viewportRef.offsetHeight;
      this.props.viewportResized({ sceneDataPath, viewportWidth, viewportHeight });
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
        width: this.props.sceneSize.x * this.props.tileSize,
        height: this.props.sceneSize.y * this.props.tileSize
      };
    }

    dragdealerOptions() {
      return {
        x: this.props.viewportPosition.x,
        y: this.props.viewportPosition.y,
        vertical: true,
        speed: 0.2,
        loose: true,
        requestAnimationFrame: true,
        animationCallback: this.dragdealerAnimationCallback
      };
    }

    dragdealerAnimationCallback(x, y) {
      const position = { x, y };
      const { sceneDataPath } = this.props;
      this.props.viewportPositionUpdated({ sceneDataPath, position });
    }
  }
);
