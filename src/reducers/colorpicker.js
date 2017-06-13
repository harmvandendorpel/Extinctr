import {
  COLORPICKER_SET_COLOR
} from '../constants/ActionTypes';

const initState = {
  color: [255, 255, 255, 255] // white
};

export default function colorpicker(state = initState, action) {
  switch (action.type) {
    case COLORPICKER_SET_COLOR:
      return { ...state, color: action.color};

    default:
      return state;
  }
}
