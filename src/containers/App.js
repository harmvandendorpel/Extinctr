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

  pause() {
    this.props.actions.pause();
  }

  play() {
    this.props.actions.play();
  }

  render() {
    const faller = this.props.loaded ? (
      <div>
        <CollapsrCanvas
          scatter={6}
          image={this.props.image}
          playing={this.props.playing}
        />
        <button onClick={this.unloadImage.bind(this)}>Unload</button>
        <button onClick={this.pause.bind(this)}>Pause</button>
        <button onClick={this.play.bind(this)}>Play</button>
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
