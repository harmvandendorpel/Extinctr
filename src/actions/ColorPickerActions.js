import { COLORPICKER_SET_COLOR } from '../constants/ActionTypes';

export function setColor(color) {
  return {
    type: COLORPICKER_SET_COLOR,
    color
  };
}
