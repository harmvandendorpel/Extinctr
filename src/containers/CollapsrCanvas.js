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

  constructor() {
    super();

    this.state = {
      averageFrameRate: 0,
      tick: 1
    };
  }

  componentDidMount() {
    faller = createFaller(
      this.canvas,
      this.props.filename,
      this.props.width,
      this.props.height,
      this.props.scatter
    );

    faller.init().then(() => this.updateCanvas());
    this.lastCalledTime = Date.now();
  }

  updateFrameRate() {
    const delta = (Date.now() - this.lastCalledTime) / 1000;
    this.lastCalledTime = Date.now();
    const averageFrameRate = this.state.averageFrameRate + 1 / delta;
    const tick = this.state.tick + 1;
    this.setState({ averageFrameRate, tick });
  }

  updateCanvas() {
    window.requestAnimationFrame(this.updateCanvas.bind(this));
    faller.update();
    this.updateFrameRate();
  }

  render() {
    const fps = Math.round(this.state.averageFrameRate / this.state.tick * 19) / 10;
    const fallerState = faller ? faller.getState() : { left: 0 };
    return (
      <div>
        <canvas ref={(canvas) => { this.canvas = canvas; }} />
        <div style={{ position: 'fixed', top: 0, left: 0, padding: '10px' }}>
          { fps } [{ fallerState.firstRow }] [{ fallerState.left }, { fallerState.right }]
        </div>
      </div>
    );
  }
}
