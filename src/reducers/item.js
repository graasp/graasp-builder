import { Map, List } from 'immutable';
import {
  GET_CHILDREN_SUCCESS,
  CREATE_ITEM_SUCCESS,
  GET_ITEM_SUCCESS,
  GET_NAVIGATION_SUCCESS,
  GET_ITEMS_SUCCESS,
  DELETE_ITEM_SUCCESS,
} from '../types/item';

const INITIAL_STATE = Map({
  item: null,
  parents: List(),
  children: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_ITEMS_SUCCESS:
      return state
        .setIn(['children'], List(payload))
        .setIn(['item'], Map())
        .setIn(['parents'], List());
    case GET_ITEM_SUCCESS:
      return state
        .setIn(['item'], Map(payload.item))
        .setIn(['children'], List(payload.children))
        .setIn(['parents'], List(payload.parents));
    case CREATE_ITEM_SUCCESS:
      return state.updateIn(['children'], (children) => children.push(payload));
    case DELETE_ITEM_SUCCESS:
      return state.updateIn(['children'], (children) =>
        children.filter((child) => child.get('id') !== payload),
      );
    case GET_CHILDREN_SUCCESS:
      return state.setIn(['children'], List(payload));
    case GET_NAVIGATION_SUCCESS:
      return state.setIn(['parents'], List(payload));
    default:
      return state;
  }
};
