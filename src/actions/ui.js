import { UI_PREVIEW_SHOW, UI_PREVIEW_HIDE } from '../constants/ActionTypes'

export function showPreview() {
  return {
    type: UI_PREVIEW_SHOW
  }
}

export function hidePreview() {
  return {
    type: UI_PREVIEW_HIDE
  }
}
