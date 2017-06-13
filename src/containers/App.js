import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DropToUpload from 'react-drop-to-upload';

import * as FallerActions from '../actions/FallerActions';
import * as RecorderActions from '../actions/RecorderActions';
import CollapsrCanvas from '../containers/CollapsrCanvas';

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

  loadImage() {
    this.props.fallerActions.imageRequest('/img/rhino.png');
  }

  unloadImage() {
    this.props.fallerActions.unloadImage();
  }

  pause() {
    this.props.fallerActions.pause();
  }

  play() {
    this.props.fallerActions.play();
  }

  handleDropDataURI([dataURI], [file]) {
    this.props.fallerActions.imageRequest(dataURI);
  }

  startRecording() {
    this.props.recorderActions.start();
  }

  stopRecording() {
    this.props.recorderActions.stop();
  }

  render() {
    const recordingButton = this.props.recording ?
      (<button onClick={this.stopRecording.bind(this)}>■</button>) :
      (<button onClick={this.startRecording.bind(this)}>●</button>);

    const playPauseButton = this.props.playing ?
      (<button onClick={this.pause.bind(this)}>‖</button>) :
      (<button onClick={this.play.bind(this)}>▶</button>);

    const previewImage = this.props.blobURL !== undefined ?
      (
        <img
          alt="preview"
          src={this.props.blobURL}
          width={this.props.image.width / window.devicePixelRatio}
          height={this.props.image.height / window.devicePixelRatio}
        />
      ) : null;

    const faller = this.props.loaded ? (
      <div>
        <CollapsrCanvas
          scatter={6}
          image={this.props.image}
          playing={this.props.playing}
          recording={this.props.recording}
          addFrame={this.props.recorderActions.addFrame}
        />
        <button onClick={this.unloadImage.bind(this)}>Unload</button>
        {playPauseButton}
        {recordingButton}
        {previewImage}
      </div>
    ) : (
      <div>
        <button onClick={this.loadImage.bind(this)}>Load</button>
        <DropToUpload onDropDataURI={this.handleDropDataURI.bind(this)}>
          Drop file here to upload
        </DropToUpload>
      </div>
    );

    return (
      <div className="main-app-container">
        { faller }
      </div>
    );
  }
}
