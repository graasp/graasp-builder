import { Map } from 'immutable';
import {
  FLAG_GETTING_CURRENT_MEMBER,
  GET_CURRENT_MEMBER_SUCCESS,
  FLAG_SIGNING_OUT,
  SIGN_OUT_SUCCESS,
  GET_CURRENT_MEMBER_ERROR,
} from '../types/member';
import { updateActivity } from './utils';

const INITIAL_STATE = Map({
  current: Map(),
  activity: Map({
    [FLAG_GETTING_CURRENT_MEMBER]: [],
    [FLAG_SIGNING_OUT]: [],
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_CURRENT_MEMBER:
    case FLAG_SIGNING_OUT:
      return state.updateIn(['activity', type], updateActivity(payload));
    case GET_CURRENT_MEMBER_SUCCESS:
      return state.setIn(['current'], Map(payload));
    case GET_CURRENT_MEMBER_ERROR:
      return state.setIn(['current'], Map());
    case SIGN_OUT_SUCCESS:
      return state.setIn(['current'], Map());
    default:
      return state;
  }
};
