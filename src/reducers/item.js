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
} from '../types/item';

const DEFAULT_ITEM = Map({
  parents: List(),
  children: List(),
});

const INITIAL_STATE = Map({
  item: DEFAULT_ITEM,
  items: List(),
  rootItems: List(), // items
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
  }),
});

const updateActivity = (payload) => (activity) => {
  if (payload) {
    return [...activity, payload];
  }
  return activity.slice(1);
};

const updateItemInList = (item, list) => {
  const idx = list.findIndex(({ id }) => item.id === id);
  if (idx < 0) {
    return list.push(item);
  }
  return list.set(idx, item);
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

const removeFromList = (deletedItemId) => (list) =>
  list.filter(({ id }) => id !== deletedItemId);

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_ITEM:
    case FLAG_CREATING_ITEM:
    case FLAG_GETTING_OWN_ITEMS:
    case FLAG_DELETING_ITEM:
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
      const from = state.getIn(['item', 'id']);
      // add item in children or in root items
      if (!from) {
        return state.update('rootItems', updateInList(payload));
      }
      return state.updateIn(['item', 'children'], updateInList(payload));
    }
    case DELETE_ITEM_SUCCESS:
    case MOVE_ITEM_SUCCESS: {
      const from = state.getIn(['item', 'id']);
      // delete item in children or in root items
      if (!from) {
        return state.update('rootItems', removeFromList(payload));
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
        return state.updateIn(['rootItems'], updateInList(item));
      }
      return state;
    }
    case GET_CHILDREN_SUCCESS: {
      return state.updateIn(['items'], updateInList(payload.children));
    }
    case GET_OWN_ITEMS_SUCCESS: {
      return state
        .setIn(['rootItems'], List(payload))
        .updateIn(['items'], updateInList(payload));
    }
    case EDIT_ITEM_SUCCESS: {
      // update current elements
      if (state.getIn(['item', 'id'])) {
        return state.updateIn(['item', 'children'], updateInList(payload));
      }

      // update home elements
      return state.updateIn(['rootItems'], updateInList(payload));
    }
    default:
      return state;
  }
};
