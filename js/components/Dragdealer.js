import Component from 'inferno-component';
import RealDragdealer from 'dragdealer';

import onWindowResize from '../on-window-resize';

export default class Dragdealer extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  componentDidMount() {
    this.realDragdealer = new RealDragdealer(
      this.wrapperRef,
      this.props.options
    );

    onWindowResize('dragdealer', this.reflowAsync.bind(this));
    this.reflowAsync();
  }

  reflowAsync() {
    setTimeout(this.realDragdealer.reflow.bind(this.realDragdealer), 0);
  }

  componentWillUnmount() {
    this.realDragdealer.unbindEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.realDragdealer) {
      return;
    }

    const currentValue = this.realDragdealer.getValue();
    if (nextProps.options.x != currentValue[0] || nextProps.options.y != currentValue[1]) {
      this.realDragdealer.setValue(nextProps.options.x, nextProps.options.y);
    }
  }

  render() {
    return (
      <div ref={this.setWrapperRef} style={this.props.wrapperStyle}>
        <div className="handle" style={this.props.handleStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }

  setWrapperRef(wrapperRef) {
    this.wrapperRef = wrapperRef;
  }
}
