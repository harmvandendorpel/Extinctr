import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createFaller from '../canvas/faller';

let faller = null; // for performance sake not a local variable

export default class CollapsrCanvas extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    scatter: PropTypes.number.isRequired,
    playing: PropTypes.bool.isRequired,
    addFrame: PropTypes.func.isRequired,
    recording: PropTypes.bool.isRequired,
    fixedColor: PropTypes.bool.isRequired
  };

  componentDidMount() {
    faller = createFaller(
      this.canvas,
      this.props.image,
      this.props.scatter
    );

    faller.init();
    this.removed = false;
    this.update();
  }

  componentWillUnmount() {
    this.removed = true;
  }

  update() {
    if (this.removed) return;
    window.requestAnimationFrame(this.update.bind(this));
    if (!this.props.playing) return;
    faller.update();
    if (this.props.recording) {
      this.props.addFrame(this.canvas);
    }
  }

  render() {
    if (faller) faller.setFixedColor(this.props.fixedColor);
    return (
      <canvas className={'faller'} ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
