import * as Api from '../api';
import {
  FLAG_GETTING_CURRENT_MEMBER,
  GET_CURRENT_MEMBER_SUCCESS,
  FLAG_SIGNING_OUT,
  SIGN_OUT_SUCCESS,
  GET_CURRENT_MEMBER_ERROR,
  SIGN_OUT_ERROR,
} from '../types/member';
import { createFlag } from './utils';

export const getCurrentMember = () => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_CURRENT_MEMBER, true));
    const user = await Api.getCurrentMember();
    dispatch({
      type: GET_CURRENT_MEMBER_SUCCESS,
      payload: user,
    });
  } catch (error) {
    dispatch({
      type: GET_CURRENT_MEMBER_ERROR,
      error,
    });
  } finally {
    dispatch(createFlag(FLAG_GETTING_CURRENT_MEMBER, false));
  }
};

export const signOut = () => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_SIGNING_OUT, true));
    await Api.signOut();
    dispatch({
      type: SIGN_OUT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: SIGN_OUT_ERROR,
      error,
    });
  } finally {
    dispatch(createFlag(FLAG_SIGNING_OUT, false));
  }
};
