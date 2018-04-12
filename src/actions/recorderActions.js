import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_RENDERING,
  PLAY,
  PAUSE,
  RENDERING_PROGRESS,
  SET_FRAME_RECORD_INTERVAL,
  RECORDING_DONE,
  RECORDING_UPLOAD_START,
  RECORDING_UPLOAD_COMPLETE,
  RECORDING_UPLOAD_FAIL
} from '../constants/ActionTypes'

import { showPreview, hidePreview } from './ui'

export function startRecording() {
  return (dispatch, getState) => {
    if (!getState().faller.playing) {
      dispatch({
        type: PLAY
      })
    }

    dispatch({
      type: RECORDING_START
    })
  }
}

export function stopRecording() {
  return (dispatch) => {
    dispatch({ type: PAUSE })
    dispatch({ type: RECORDING_STOP })
    dispatch({ type: RECORDING_RENDERING })
  }
}

export function renderingProgress(progress) {
  return {
    type: RENDERING_PROGRESS,
    payload: {
      progress
    }
  }
}

export function changeFrameRecordInterval(sliderInfo) {
  return {
    type: SET_FRAME_RECORD_INTERVAL,
    frameRecordInterval: sliderInfo.values[0]
  }
}

export function startUpload() {
  return (dispatch, getState) => {
    const store = getState()
    const blob = store.recorder.blob
    dispatch({ type: RECORDING_UPLOAD_START })

    const username = 'extinctrdotcom'
    const apiKey = 'UatD2Tb9OUZI8KxYYhstRjqU6rPtBo4y'

    const formData = new FormData()
    formData.append('file', blob, 'extinctr.gif')
    formData.append('username', username)
    formData.append('api_key', apiKey)
    formData.append('tags', 'extinctr')
    formData.append('source_post_url', 'https://extinctr.com')

    fetch('https://upload.giphy.com/v1/gifs', {
      method: 'POST',
      body: formData,
      mode: 'cors'
    }).then(response => response.json())
      .catch((error) => { console.error('Error:', error) })
      .then((res) => {
        if (res.meta && res.meta.status === 200) {
          const id = res.data.id
          const giphyURL = `https://giphy.com/gifs/${username}-${id}`
          // window.open(url)
          dispatch({
            type: RECORDING_UPLOAD_COMPLETE,
            payload: { giphyURL, id },
          })
          // dispatch(hidePreview())
        } else {
          dispatch({ type: RECORDING_UPLOAD_FAIL })
          console.error('Upload failed.')
        }
      })
  }
}

export function doneRecording(blob) {
  return (dispatch) => {
    dispatch({
      type: RECORDING_DONE,
      payload: {
        blob,
        blobURL: URL.createObjectURL(blob)
      }
    })
    dispatch(showPreview())
    // dispatch(startUpload(blob))
  }
}
