import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rheostat from 'rheostat'
import CollapsrCanvas from './CollapsrCanvas'
import ColorPicker from './ColorPicker'
import { niceCount } from '../helpers/stuff'
import './CollapsrCanvas.scss'
import * as fallerActions from '../actions/fallerActions'
import * as uiActions from '../actions/ui'
import * as recorderActions from '../actions/recorderActions'
import Preview from '../components/Preview'

@connect(
  state => ({
    image: state.faller.image,
    ui: state.ui,
    playing: state.faller.playing,
    uploading: state.recorder.uploading,
    recording: state.recorder.recording,
    blobURL: state.recorder.blobURL,
    giphyURL: state.recorder.giphyURL,
    progressRendering: state.recorder.progress,
    rendering: state.recorder.rendering,
    transparentColor: state.faller.transparentColor,
    scatter: state.faller.scatter,
    interactive: state.faller.interactive,
    frameRecordInterval: state.recorder.frameRecordInterval
  }),
  { ...fallerActions, ...uiActions, ...recorderActions }
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
    interactive: PropTypes.bool.isRequired,
    ui: PropTypes.object.isRequired,
    hidePreview: PropTypes.func.isRequired,
    startUpload: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    giphyURL: PropTypes.string
  }

  static defaultProps = {
    blobURL: null,
    giphyURL: null
  }

  recordingButton() {
    const { rendering, progressRendering } = this.props
    if (rendering) {
      return (<button className="tool-button" disabled>rendering ({progressRendering * 100 << 0}%)...</button>)
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

  // previewImage() {
  //   return this.props.blobURL !== null ?
  //     (
  //       <img
  //         alt="preview"
  //         src={this.props.blobURL}
  //         width={this.props.image.width / window.devicePixelRatio}
  //         height={this.props.image.height / window.devicePixelRatio}
  //       />
  //     ) : null
  // }

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
      toggleInteractive,
      interactive,
      rendering,
      playing
    } = this.props
    if (rendering || playing) return null

    return [
      <button
        key="button-reset"
        className="tool-button"
        onClick={this.props.resetImage.bind(this)}
      >reset</button>,
      <button
        key="button-unload"
        className="tool-button"
        onClick={this.props.unloadImage.bind(this)}
      >load</button>,
      this.colorPicker(),
      <button
        onClick={toggleInteractive.bind(this)}
        checked={interactive}
        key="button-interactive"
        className="tool-button"
      >{interactive ? 'interactive' : 'automatic'}</button>,
    ]
  }

  render() {
    const {
      frameRecordInterval,
      changeFrameRecordInterval,
      rendering,
      playing,
      blobURL,
      ui: { preview },
      image,
      hidePreview,
      startUpload,
      uploading,
      giphyURL
    } = this.props
    return [
      <div className={preview.visible ? 'blurred' : null} key="player">
        <div className="canvas-container" key="canvas-container">
          <CollapsrCanvas
            onCanvasReady={this.props.onCanvasReady}
          />
        </div>
        <div className="tools-container">
          {this.playPauseButton()}
          {this.recordingButton()}
          {this.options()}

          <div className="sliders">
            {!rendering &&
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
            }
            {!rendering && !playing &&
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
            }
          </div>
        </div>
      </div>,
      <Preview
        key="preview"
        visible={preview.visible}
        imageURL={blobURL}
        width={image.width}
        height={image.height}
        onClose={hidePreview}
        onSave={startUpload}
        uploading={uploading}
        giphyURL={giphyURL}
      />
    ]
  }
}
