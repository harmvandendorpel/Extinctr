import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CollapsrCanvas extends Component {
  static propTypes = {
    // image: PropTypes.object.isRequired,
    // scatter: PropTypes.number.isRequired,
    // playing: PropTypes.bool.isRequired,
    // addFrame: PropTypes.func.isRequired,
    // recording: PropTypes.bool.isRequired,
    // fixedColor: PropTypes.array.isRequired
    onCanvasReady: PropTypes.func.isRequired
  };

  componentDidMount() {
    // faller = createFaller(
    //   this.canvas,
    //   this.props.image,
    //   this.props.fixedColor,
    //   this.props.scatter
    // );
    //
    // faller.init();
    // this.removed = false;
    // this.update();
    this.props.onCanvasReady(this.canvas);
  }

  // componentWillUnmount() {
    // this.removed = true;
  // }

  // update() {
    // if (this.removed) return;
    // window.requestAnimationFrame(this.update.bind(this));
    // if (!this.props.playing) return;
    // // faller.update();
    // if (this.props.recording) {
    //   // this.props.addFrame(this.canvas);
    // }
  // }

  render() {
    return (
      <canvas className={'faller'} ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
