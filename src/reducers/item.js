import { Map, List } from 'immutable';
import { ROOT_ID } from '../config/constants';
import {
  SET_ITEM_SUCCESS,
  DELETE_ITEM_SUCCESS,
  CLEAR_ITEM_SUCCESS,
  GET_ITEM_SUCCESS,
  MOVE_ITEM_SUCCESS,
  COPY_ITEM_SUCCESS,
  GET_CHILDREN_SUCCESS,
  FLAG_GETTING_ITEM,
  FLAG_CREATING_ITEM,
  FLAG_GETTING_OWN_ITEMS,
  FLAG_DELETING_ITEM,
  FLAG_GETTING_CHILDREN,
  GET_OWN_ITEMS_SUCCESS,
  GET_ITEMS_SUCCESS,
  FLAG_GETTING_ITEMS,
  CREATE_ITEM_SUCCESS,
  FLAG_MOVING_ITEM,
  FLAG_COPYING_ITEM,
  FLAG_SETTING_ITEM,
  EDIT_ITEM_SUCCESS,
  FLAG_EDITING_ITEM,
  GET_SHARED_ITEMS_SUCCESS,
  DELETE_ITEMS_SUCCESS,
  FLAG_DELETING_ITEMS,
} from '../types/item';
import { updateActivity } from './utils';

const DEFAULT_ITEM = Map({
  parents: List(),
  children: List(),
});

const INITIAL_STATE = Map({
  item: DEFAULT_ITEM,
  items: List(),
  shared: List(),
  own: List(), // items
  activity: Map({
    [FLAG_GETTING_ITEM]: [],
    [FLAG_CREATING_ITEM]: [],
    [FLAG_GETTING_OWN_ITEMS]: [],
    [FLAG_DELETING_ITEM]: [],
    [FLAG_GETTING_CHILDREN]: [],
    [FLAG_GETTING_ITEMS]: [],
    [FLAG_MOVING_ITEM]: [],
    [FLAG_COPYING_ITEM]: [],
    [FLAG_SETTING_ITEM]: [],
    [FLAG_EDITING_ITEM]: [],
    [FLAG_DELETING_ITEMS]: [],
  }),
});

const updateItemInList = (item, list) => {
  let idx = list.findIndex(({ id }) => item.id === id);
  idx = idx < 0 ? list.size : idx;
  return list.update(idx, () => item);
};

const updateInList = (els) => (list) => {
  // add array of items
  if (Array.isArray(els)) {
    let newList = list;
    els.forEach((item) => {
      newList = updateItemInList(item, newList);
    });
    return newList;
  }

  // add one item
  return updateItemInList(els, list);
};

const removeFromList = ({ id: deletedItemId }) => (list) =>
  list.filter(({ id }) => id !== deletedItemId);

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_ITEM:
    case FLAG_CREATING_ITEM:
    case FLAG_GETTING_OWN_ITEMS:
    case FLAG_DELETING_ITEM:
    case FLAG_DELETING_ITEMS:
    case FLAG_GETTING_CHILDREN:
    case FLAG_GETTING_ITEMS:
    case FLAG_MOVING_ITEM:
    case FLAG_COPYING_ITEM:
    case FLAG_SETTING_ITEM:
    case FLAG_EDITING_ITEM:
      return state.updateIn(['activity', type], updateActivity(payload));
    case CLEAR_ITEM_SUCCESS:
      return state.setIn(['item'], DEFAULT_ITEM);
    case GET_ITEM_SUCCESS: {
      return state;
    }
    case GET_ITEMS_SUCCESS: {
      return state.set('items', List(payload));
    }
    case SET_ITEM_SUCCESS: {
      const { item, parents, children } = payload;
      return state
        .setIn(['item'], Map(item))
        .setIn(['item', 'children'], List(children))
        .setIn(['item', 'parents'], List(parents))
        .updateIn(['items'], updateInList([...parents, ...children, item]));
    }
    case CREATE_ITEM_SUCCESS: {
      const updatedState = state.updateIn(['items'], updateInList([payload]));
      const from = updatedState.getIn(['item', 'id']);
      // add item in children or in root items
      if (!from) {
        return updatedState.update('own', updateInList(payload));
      }
      return updatedState.updateIn(['item', 'children'], updateInList(payload));
    }
    case DELETE_ITEMS_SUCCESS: {
      let newState = state;
      const from = newState.getIn(['item', 'id']);
      for (const id of payload) {
        // delete item in children or in root items
        if (!from) {
          newState = newState.update('own', removeFromList({ id }));
        }
        newState = newState.updateIn(
          ['item', 'children'],
          removeFromList({ id }),
        );
      }
      return newState;
    }
    case DELETE_ITEM_SUCCESS:
    case MOVE_ITEM_SUCCESS: {
      const from = state.getIn(['item', 'id']);
      // delete item in children or in root items
      if (!from) {
        return state.update('own', removeFromList(payload));
      }
      return state.updateIn(['item', 'children'], removeFromList(payload));
    }
    case COPY_ITEM_SUCCESS: {
      // add new item to current view
      const { to, item } = payload;
      if (to === state.getIn(['item', 'id'])) {
        return state.updateIn(['item', 'children'], updateInList(item));
      }
      if (to === ROOT_ID) {
        return state.updateIn(['own'], updateInList(item));
      }
      return state;
    }
    case GET_CHILDREN_SUCCESS: {
      return state.updateIn(['items'], updateInList(payload.children));
    }
    case GET_SHARED_ITEMS_SUCCESS:
      return state
        .setIn(['shared'], List(payload))
        .updateIn(['items'], updateInList(payload));
    case GET_OWN_ITEMS_SUCCESS:
      return state
        .setIn(['own'], List(payload))
        .updateIn(['items'], updateInList(payload));

    case EDIT_ITEM_SUCCESS: {
      const updatedState = state.updateIn(['items'], updateInList([payload]));
      // update current elements
      if (updatedState.getIn(['item', 'id'])) {
        return updatedState.updateIn(
          ['item', 'children'],
          updateInList(payload),
        );
      }

      // update home elements
      return updatedState.updateIn(['own'], updateInList(payload));
    }
    default:
      return state;
  }
};
