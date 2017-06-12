import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createFaller from '../canvas/faller';

let faller = null;

export default class CollapsrCanvas extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    scatter: PropTypes.number.isRequired,
    playing: PropTypes.bool.isRequired
  };

  componentDidMount() {
    faller = createFaller(
      this.canvas,
      this.props.image,
      this.props.scatter
    );

    faller.init();
    this.removed = false;
    this.drawCanvas();
  }

  componentWillUnmount() {
    this.removed = true;
  }

  drawCanvas() {
    if (!this.props.playing || this.removed) return;
    window.requestAnimationFrame(this.drawCanvas.bind(this));
    faller.update();
  }

  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
