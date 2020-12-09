import { Map } from 'immutable';
import {
  SET_MOVE_MODAL_SETTINGS,
  SET_COPY_MODAL_SETTINGS,
} from '../types/layout';

const INITIAL_STATE = Map({
  moveModal: Map({
    open: false,
    itemId: null,
  }),
  copyModal: Map({
    open: false,
    itemId: null,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_COPY_MODAL_SETTINGS:
      return state.setIn(['copyModal'], Map(payload));
    case SET_MOVE_MODAL_SETTINGS:
      return state.setIn(['moveModal'], Map(payload));
    default:
      return state;
  }
};
