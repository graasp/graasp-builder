import { Map } from 'immutable';
import {
  SET_MOVE_MODAL_SETTINGS,
  SET_COPY_MODAL_SETTINGS,
  SET_EDIT_MODAL_SETTINGS,
  SET_SHARE_MODAL_SETTINGS,
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
  editModal: Map({
    open: false,
    itemId: null,
  }),
  shareModal: Map({
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
    case SET_EDIT_MODAL_SETTINGS:
      return state.setIn(['editModal'], Map(payload));
    case SET_SHARE_MODAL_SETTINGS:
      return state.setIn(['shareModal'], Map(payload));
    default:
      return state;
  }
};
