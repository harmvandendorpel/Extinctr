import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FallerActions from '../actions/FallerActions';
import CollapsrCanvas from '../containers/CollapsrCanvas';

@connect(
  state => ({
    loaded: state.faller.loaded,
    image: state.faller.image,
    playing: state.faller.playing
  }),
  dispatch => ({
    actions: bindActionCreators(FallerActions, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    image: PropTypes.object,
    playing: PropTypes.bool.isRequired
  };

  loadImage() {
    this.props.actions.imageRequest('/img/rhino.png');
  }

  unloadImage() {
    this.props.actions.unloadImage();
  }

  render() {
    const opts = {
      image: this.props.image,
      scatter: 6
    };

    if (this.props.playing) {
      opts.playing = true;
    }

    const faller = this.props.loaded ? (
      <div>
        <CollapsrCanvas {...opts} />
        <button onClick={this.unloadImage.bind(this)}>Unload</button>
      </div>
    ) : (
      <button onClick={this.loadImage.bind(this)}>Load</button>
    );

    return (
      <div className="main-app-container">
        { faller }
      </div>
    );
  }
}
