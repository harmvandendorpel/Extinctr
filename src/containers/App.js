import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FallerActions from '../actions/FallerActions';
import * as RecorderActions from '../actions/RecorderActions';
import ScreenUpload from '../components/ScreenUpload';
import ScreenRecord from '../components/ScreenRecord';

@connect(
  state => ({
    loaded: state.faller.loaded,
    image: state.faller.image,
    playing: state.faller.playing,
    recording: state.recorder.recording,
    blobURL: state.recorder.blobURL
  }),
  dispatch => ({
    fallerActions: bindActionCreators(FallerActions, dispatch),
    recorderActions: bindActionCreators(RecorderActions, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    image: PropTypes.object,
    playing: PropTypes.bool.isRequired,
    recording: PropTypes.bool.isRequired,
    blobURL: PropTypes.string
  };

  render() {
    const screen = this.props.loaded ?
      (<ScreenRecord
        recording={this.props.recording}
        playing={this.props.playing}
        blobURL={this.props.blobURL}
        image={this.props.image}
        play={this.props.fallerActions.play}
        pause={this.props.fallerActions.pause}
        unloadImage={this.props.fallerActions.unloadImage}
        startRecording={this.props.recorderActions.start}
        stopRecording={this.props.recorderActions.stop}
        addFrame={this.props.recorderActions.addFrame}
      />)
    :
      (<ScreenUpload
        imageRequest={this.props.fallerActions.imageRequest}
      />);

    return (
      <div className="main-app-container">
        { screen }
      </div>
    );
  }
}
