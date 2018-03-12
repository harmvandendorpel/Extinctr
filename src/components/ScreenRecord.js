import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rheostat from 'rheostat'
import CollapsrCanvas from './CollapsrCanvas'
import ColorPicker from './ColorPicker'
import { niceCount } from '../helpers/stuff'
import './CollapsrCanvas.scss'
import * as FallerActions from '../actions/FallerActions'
import * as RecorderActions from '../actions/RecorderActions'

@connect(
  state => ({
    image: state.faller.image,
    playing: state.faller.playing,
    recording: state.recorder.recording,
    blobURL: state.recorder.blobURL,
    rendering: state.recorder.rendering,
    transparentColor: state.faller.transparentColor,
    scatter: state.faller.scatter,
    interactive: state.faller.interactive,
    frameRecordInterval: state.recorder.frameRecordInterval
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
    changeFrameRecordInterval: RecorderActions.changeFrameRecordInterval,
    setTransparentColor: FallerActions.setTransparentColor,
    toggleInteractive: FallerActions.toggleInteractive
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
    toggleInteractive: PropTypes.func.isRequired,
    changeFrameRecordInterval: PropTypes.func.isRequired,
    frameRecordInterval: PropTypes.number.isRequired,
    scatter: PropTypes.number.isRequired,
    interactive: PropTypes.bool.isRequired
  };

  static defaultProps = {
    blobURL: null
  };

  recordingButton() {
    if (this.props.rendering) {
      return (<button className="tool-button" disabled>rendering...</button>)
    }
    return this.props.recording ?
      <button className="tool-button" onClick={this.props.stopRecording.bind(this)}>■</button> :
      this.props.playing ?
        null :
        <button className="tool-button" style={{ color: 'red' }}onClick={this.props.startRecording.bind(this)}>●</button>
  }

  playPauseButton() {
    if (this.props.recording) return null
    return this.props.playing ?
      <button className="tool-button" onClick={this.props.pauseAnimation.bind(this)}>‖</button> :
      this.props.rendering ?
        null :
        <button className="tool-button" style={{ fontSize: '12px' }} onClick={this.props.playAnimation.bind(this)}>▶</button>
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
      ) : null
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
    )
  }

  options() {
    const {
      frameRecordInterval,
      changeFrameRecordInterval,
      toggleInteractive,
      interactive,
      rendering,
      playing
    } = this.props
    if (rendering || playing) return null

    return [
      <button className="tool-button" onClick={this.props.resetImage.bind(this)}>reset</button>,
      <button className="tool-button" onClick={this.props.unloadImage.bind(this)}>load</button>,
      this.colorPicker(),
      <button
        onClick={toggleInteractive.bind(this)}
        checked={interactive}
        className="tool-button"
      >{interactive ? 'interactive' : 'automatic'}</button>,

      <div className="slider-container">
        <label>
          {frameRecordInterval === 0 ?
            'record every frame' : `record every ${niceCount(frameRecordInterval + 1)} frame`}
          <Rheostat
            onValuesUpdated={changeFrameRecordInterval.bind(this)}
            min={0}
            max={19}
            values={[frameRecordInterval]}
          />
        </label>
      </div>
    ]
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
        <div className="slider-container">
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
      </div>
    )
  }
}
