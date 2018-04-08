import isEqual from 'lodash.isequal'
import { toHex } from '../helpers/colors'
import {
  IMAGE_CANVAS_READY,
  PLAY,
  PAUSE,
  RECORDING_START,
  RECORDING_STOP,
  IMAGE_LOADED,
  SET_TRANSPARENT_COLOR,
  SET_SCATTER,
  TOGGLE_INTERACTIVE,
  SET_FRAME_RECORD_INTERVAL
} from '../constants/ActionTypes'
import createFaller from '../canvas/faller'
import createRecorder from '../canvas/recorder'
import { doneRecording } from '../actions/recorderActions'

let recorder = null
let faller = null
let canvas = null
let image = null

let playing = false
let recording = false
let transparentColor = null
let frameRecordIntervalCounter = 0
let frameRecordInterval = null

function update() {
  window.requestAnimationFrame(update)
  if (!playing) return
  if (recording) {
    if (frameRecordIntervalCounter >= frameRecordInterval) {
      recorder.addFrame()
      frameRecordIntervalCounter = 0
    } else {
      frameRecordIntervalCounter++
    }
  }
  faller.update()
}

function initFaller(store) {
  if (!image || !canvas) return
  const state = store.getState()
  const settings = {
    ...state.faller,
    image
  }

  transparentColor = settings.transparentColor
  frameRecordInterval = state.recorder.frameRecordInterval
  if (faller) faller.destroy()
  faller = createFaller(
    canvas, settings
  )
}

const fallerMiddleware = store => next => (action) => {
  const result = next(action)
  switch (action.type) {
    case IMAGE_LOADED:
      image = action.image
      initFaller(store)
      break

    case IMAGE_CANVAS_READY:
      canvas = action.canvas
      initFaller(store)
      break

    case PLAY:
      playing = true
      break

    case PAUSE:
      playing = false
      break

    case RECORDING_START:
      if (recorder) recorder.destroy()
      recorder = createRecorder(canvas, {
        backgroundColor: toHex(transparentColor)
      })
      recording = true
      break

    case RECORDING_STOP:
      recording = false
      // URL.createObjectURL
      recorder.save().then(blob => store.dispatch(doneRecording(blob)))
      break

    case SET_TRANSPARENT_COLOR:
      if (!isEqual(
        store.getState().faller.transparentColor,
          transparentColor)
      ) {
        initFaller(store)
      }
      break

    case TOGGLE_INTERACTIVE:
      initFaller(store)
      break

    case SET_SCATTER:
      faller.setScatter(action.scatter)
      break

    case SET_FRAME_RECORD_INTERVAL:
      frameRecordInterval = action.frameRecordInterval
      break

    default:
      break
  }
  return result
}

update()

export default fallerMiddleware
