import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ColorPicker.scss';

const initialState = {
  sampling: false,
  current: [255,255,255,255]
};

export default class ColorPicker extends Component {
  static propTypes = {
    canvasSelector: PropTypes.string.isRequired,
    onPick: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = initialState;
  }

  componentDidMount() {
    const canvas = document.querySelector(this.props.canvasSelector);
    if (!canvas) throw new Error('no canvas found');
    const ctx = canvas.getContext('2d');

    this.width = canvas.width;
    this.height = canvas.height;

    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    this.pixels = imageData.data;

    canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
  }

  mouseMoveHandler(e) {
    if (!this.state.sampling) return;
    const x = e.offsetX * window.devicePixelRatio;
    const y = e.offsetY * window.devicePixelRatio;
    const index = (x + y * this.width) * 4;

    const current = [
      this.pixels[index],
      this.pixels[index + 1],
      this.pixels[index + 2],
      this.pixels[index + 3]
    ];

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
      current: null,
      sampling: true
    });
  }

  cssColor() {
    if (!this.state.current) return;
    const c = this.state.current;
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
  }

  render() {
    return (<div
      className={'ColorPicker'}
      style={{ backgroundColor: this.cssColor() }}
      onClick={this.startSampling.bind(this)}
    >&nbsp;</div>);
  }
}
