import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rheostat from 'rheostat';
import CollapsrCanvas from './CollapsrCanvas';
import ColorPicker from './ColorPicker';
import './CollapsrCanvas.scss';
import * as FallerActions from '../actions/FallerActions';
import * as RecorderActions from '../actions/RecorderActions';

@connect(
  state => ({
    image: state.faller.image,
    playing: state.faller.playing,
    recording: state.recorder.recording,
    blobURL: state.recorder.blobURL,
    rendering: state.recorder.rendering,
    transparentColor: state.faller.transparentColor,
    scatter: state.faller.scatter
  }),
  {
    onCanvasReady: FallerActions.onCanvasReady,
    stopRecording: RecorderActions.stop,
    startRecording: RecorderActions.start,
    pauseAnimation: FallerActions.pause,
    playAnimation: FallerActions.play,
    resetImage: FallerActions.resetImage,
    unloadImage: FallerActions.unloadImage,
    changeScatter: FallerActions.changeScatter,
    setTransparentColor: FallerActions.setTransparentColor
  }
)
export default class ScreenRecord extends Component {
  static propTypes = {
    recording: PropTypes.bool.isRequired,
    playing: PropTypes.bool.isRequired,
    blobURL: PropTypes.string,
    image: PropTypes.object.isRequired,
    rendering: PropTypes.bool.isRequired,
    stopRecording: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired,
    pauseAnimation: PropTypes.func.isRequired,
    playAnimation: PropTypes.func.isRequired,
    resetImage: PropTypes.func.isRequired,
    unloadImage: PropTypes.func.isRequired,
    setTransparentColor: PropTypes.func.isRequired,
    transparentColor: PropTypes.arrayOf(PropTypes.number).isRequired,
    onCanvasReady: PropTypes.func.isRequired,
    changeScatter: PropTypes.func.isRequired,
    scatter: PropTypes.number.isRequired
  };

  static defaultProps = {
    blobURL: null
  };

  recordingButton() {
    if (this.props.rendering) {
      return (<button>rendering...</button>);
    }
    return this.props.recording ?
      <button onClick={this.props.stopRecording.bind(this)}>■</button> :
      this.props.playing ?
        null :
        <button onClick={this.props.startRecording.bind(this)}>●</button>;
  }

  playPauseButton() {
    if (this.props.recording) return null;
    return this.props.playing ?
      <button onClick={this.props.pauseAnimation.bind(this)}>‖</button> :
      this.props.rendering ?
        null :
        <button onClick={this.props.playAnimation.bind(this)}>▶</button>;
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
    return (
      <span>
        <button onClick={this.props.resetImage.bind(this)}>reset</button>
        <button onClick={this.props.unloadImage.bind(this)}>&times;</button>
      </span>
    );
  }

  colorPicker() {
    return (
      <ColorPicker
        color={this.props.transparentColor}
        canvasSelector={'.faller'}
        onPick={this.props.setTransparentColor.bind(this)}
        width={this.props.image.width}
        height={this.props.image.height}
      />
    );
  }

  options() {
    if (this.props.rendering || this.props.playing) return null;
    return (
      <div>
        {this.loadingButtons()}
        {this.colorPicker()}
      </div>
    );
  }

  render() {
    return (
      <div>
        <CollapsrCanvas
          onCanvasReady={this.props.onCanvasReady}
        />
        {this.playPauseButton()}
        {this.recordingButton()}
        {this.options()}
        <label>
          scatter {this.props.scatter * 100 << 0}%
          <Rheostat
            onValuesUpdated={this.props.changeScatter.bind(this)}
            min={0}
            max={95}
            values={[this.props.scatter * 100]}
          />
        </label>
      </div>
    );
  }
}
