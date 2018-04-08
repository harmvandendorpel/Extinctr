import {
  UI_PREVIEW_SHOW,
  UI_PREVIEW_HIDE
} from '../constants/ActionTypes'

const initState = {
  preview: {
    visible: false
  }
}

export default function (state = initState, action) {
  switch (action.type) {
    case UI_PREVIEW_SHOW:
      return {
        ...state,
        preview: {
          ...state.preview,
          visible: true
        }
      }

    case UI_PREVIEW_HIDE:
      return {
        ...state,
        preview: {
          ...state.preview,
          visible: false
        }
      }
    default:
      return state
  }
}
