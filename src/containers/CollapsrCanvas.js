import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createFaller from '../canvas/faller';

let faller = null;

export default class CollapsrCanvas extends Component {
  static propTypes = {
    filename: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scatter: PropTypes.number.isRequired
  };

  // constructor() {
  //   super();
  //
  //   this.state = {
  //     averageFrameRate: 0,
  //     tick: 1
  //   };
  // }

  componentDidMount() {
    faller = createFaller(
      this.canvas,
      this.props.filename,
      this.props.width,
      this.props.height,
      this.props.scatter
    );

    faller.init().then(() => {
      this.drawCanvas();
      faller.startUpdating();
    });
    // this.lastCalledTime = Date.now();
  }
  //
  // updateFrameRate() {
  //   const delta = (Date.now() - this.lastCalledTime) / 1000;
  //   this.lastCalledTime = Date.now();
  //   const averageFrameRate = this.state.averageFrameRate + 1 / delta;
  //   const tick = this.state.tick + 1;
  //   this.setState({ averageFrameRate, tick });
  // }

  drawCanvas() {
    window.requestAnimationFrame(this.drawCanvas.bind(this));
    faller.draw();
    // this.updateFrameRate();
  }

  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
