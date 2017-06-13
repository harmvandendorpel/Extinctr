import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollapsrCanvas from '../containers/CollapsrCanvas';

export default class ScreenRecord extends Component {
  static propTypes = {
    recording: PropTypes.bool.isRequired,
    playing: PropTypes.bool.isRequired,
    blobURL: PropTypes.string,
    image: PropTypes.object.isRequired,

    addFrame: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    unloadImage: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired
  };

  render() {
    const recordingButton = this.props.recording ?
      (<button onClick={this.props.stopRecording.bind(this)}>■</button>) :
      (<button onClick={this.props.startRecording.bind(this)}>●</button>);

    const playPauseButton = this.props.playing ?
      (<button onClick={this.props.pause.bind(this)}>‖</button>) :
      (<button onClick={this.props.play.bind(this)}>▶</button>);

    const previewImage = this.props.blobURL !== undefined ?
      (
        <img
          alt="preview"
          src={this.props.blobURL}
          width={this.props.image.width / window.devicePixelRatio}
          height={this.props.image.height / window.devicePixelRatio}
        />
      ) : null;

    return (<div>
      <CollapsrCanvas
        scatter={6}
        image={this.props.image}
        playing={this.props.playing}
        recording={this.props.recording}
        addFrame={this.props.addFrame}
      />
      {playPauseButton}
      {recordingButton}
      <button onClick={this.props.unloadImage.bind(this)}>&times;</button>
      {previewImage}
    </div>);
  }
}
