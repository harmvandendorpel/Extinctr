import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollapsrCanvas from './CollapsrCanvas';
import ColorPicker from './ColorPicker';
import './CollapsrCanvas.scss';

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
    stopRecording: PropTypes.func.isRequired,
    rendering: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    setColor: PropTypes.func.isRequired
  };

  static defaultProps = {
    blobURL: null
  };

  recordingButton() {
    if (this.props.rendering) {
      return (<button>rendering...</button>);
    }
    return this.props.recording ?
      (<button onClick={this.props.stopRecording.bind(this)}>■</button>) :
      (<button onClick={this.props.startRecording.bind(this)}>●</button>);
  }

  playPauseButton() {
    return this.props.playing ?
      (<button onClick={this.props.pause.bind(this)}>‖</button>) :
      (<button onClick={this.props.play.bind(this)}>▶</button>);
  }

  previewImage() {
    return this.props.blobURL !== null ?
      (
        <img
          alt="preview"
          src={this.props.blobURL}
          width={this.props.image.width / window.devicePixelRatio}
          height={this.props.image.height / window.devicePixelRatio}
        />
      ) : null;
  }

  loadingButtons() {
    if (this.props.rendering || this.props.playing) return null;
    return (
      <span>
        <button onClick={this.props.reset.bind(this)}>reset</button>
        <button onClick={this.props.unloadImage.bind(this)}>&times;</button>
      </span>
    );
  }

  colorPicked(color) {
    this.props.setColor(color);
  }

  render() {
    return (
      <div>
        <CollapsrCanvas
          scatter={6}
          image={this.props.image}
          playing={this.props.playing}
          recording={this.props.recording}
          addFrame={this.props.addFrame}
        />
        {this.playPauseButton()}
        {this.recordingButton()}
        {this.loadingButtons()}
        <ColorPicker canvasSelector={'.faller'} onPick={this.colorPicked.bind(this)} />
        {this.previewImage()}
      </div>
    );
  }
}
