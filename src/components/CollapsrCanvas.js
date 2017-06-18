import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CollapsrCanvas extends Component {
  static propTypes = {
    onCanvasReady: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.onCanvasReady(this.canvas);
  }

  render() {
    return (
      <canvas className={'faller'} ref={(canvas) => { this.canvas = canvas; }} />
    );
  }
}
