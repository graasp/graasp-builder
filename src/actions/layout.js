import {
  SET_COPY_MODAL_SETTINGS,
  SET_EDIT_MODAL_SETTINGS,
  SET_MOVE_MODAL_SETTINGS,
} from '../types/layout';

export const setMoveModalSettings = (payload) => (dispatch) => {
  dispatch({
    type: SET_MOVE_MODAL_SETTINGS,
    payload,
  });
};

export const setCopyModalSettings = (payload) => (dispatch) => {
  dispatch({
    type: SET_COPY_MODAL_SETTINGS,
    payload,
  });
};

export const setEditModalSettings = (payload) => (dispatch) => {
  dispatch({
    type: SET_EDIT_MODAL_SETTINGS,
    payload,
  });
};
