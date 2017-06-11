import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createFaller from '../canvas/faller';

let faller = null;

export default class CollapsrCanvas extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scatter: PropTypes.number.isRequired,
    playing: PropTypes.bool.isRequired
  };

  componentDidMount() {
    faller = createFaller(
      this.canvas,
      this.props.image,
      this.props.width,
      this.props.height,
      this.props.scatter
    );

    faller.init().then(() => {
      this.drawCanvas();
      faller.start();
    });
  }

  drawCanvas() {
    if (!this.props.playing) return;
    window.requestAnimationFrame(this.drawCanvas.bind(this));
    faller.draw();
  }

  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
