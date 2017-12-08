import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ColorPicker.scss';

const colorPickerCursorClassName = 'faller__color-picker';

export default class ColorPicker extends Component {
  static propTypes = {
    canvasSelector: PropTypes.string.isRequired,
    color: PropTypes.arrayOf(PropTypes.number).isRequired,
    onPick: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      sampling: false,
      current: this.props.color
    };
  }

  componentDidMount() {
    const canvas = document.querySelector(this.props.canvasSelector);
    canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
  }

  getPixelColor(x, y) {
    const canvas = document.querySelector(this.props.canvasSelector);
    const ctx = canvas.getContext('2d');

    const imageData = ctx.getImageData(0, 0, this.props.width, this.props.height);
    this.pixels = imageData.data;

    const index = (x + y * this.props.width) * 4;

    return [
      this.pixels[index],
      this.pixels[index + 1],
      this.pixels[index + 2],
      this.pixels[index + 3]
    ];
  }

  mouseMoveHandler(e) {
    if (!this.state.sampling) return;
    const x = e.offsetX * window.devicePixelRatio;
    const y = e.offsetY * window.devicePixelRatio;
    const current = this.getPixelColor(x, y);
    this.setState({ current });
  }

  mouseDownHandler() {
    if (this.state.sampling) {
      this.props.onPick(this.state.current);
      this.setState({
        sampling: false
      });
    }
  }

  startSampling() {
    this.setState({
      sampling: true
    });
  }

  cssColor() {
    const c = this.state.current;
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
  }

  render() {
    const { sampling } = this.state;
    const backgroundColor = this.cssColor();
    const body = document.querySelector('body');
    const cursorClassNameFunction = sampling ?
      body.classList.add :
      body.classList.remove;

    cursorClassNameFunction.apply(body.classList, [colorPickerCursorClassName]);

    return (<div
      className={'ColorPicker'}
      style={{ backgroundColor }}
      onClick={this.startSampling.bind(this)}
    >&nbsp;</div>);
  }
}
