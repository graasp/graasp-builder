import * as Api from '../api/item';
import {
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM_SUCCESS,
  GET_OWN_ITEMS_SUCCESS,
  SET_ITEM_SUCCESS,
  CLEAR_ITEM_SUCCESS,
  GET_ITEM_SUCCESS,
  MOVE_ITEM_SUCCESS,
  COPY_ITEM_SUCCESS,
  GET_CHILDREN_SUCCESS,
  FLAG_GETTING_ITEM,
} from '../types/item';
import { getParentsIdsFromPath } from '../utils/item';
import * as CacheOperations from '../config/cache';

// eslint-disable-next-line no-unused-vars
const buildParentsLine = (path) => {
  // get parents id without self
  const parentItems = getParentsIdsFromPath(path).slice(0, -1);
  const parents = parentItems.map(
    (id) => CacheOperations.getItem(id) || Api.getItem(id),
  );
  return Promise.all(parents);
};

export const setItem = (id) => async (dispatch) => {
  try {
    let newItems = [];
    // use saved item when possible
    let item = await CacheOperations.getItem(id);
    if (!item) {
      item = await Api.getItem(id);
    }
    const { children, parents } = item;

    // get children
    let newChildren = [];
    if (!children) {
      newChildren = await Api.getChildren(id);
      newItems = newItems.concat(newChildren);
      item.children = newChildren.map(({ id: childId }) => childId);
    }

    // get parents
    let newParents = [];
    if (!parents) {
      newParents = await buildParentsLine(item.path);
      newItems = newItems.concat(newParents);
      item.parents = newParents.map(({ id: parentId }) => parentId);
    }
    newItems.push(item);
    await CacheOperations.saveItems(newItems);

    dispatch({
      type: SET_ITEM_SUCCESS,
      payload: item,
    });
  } catch (e) {
    console.error(e);
  }
};

const createFlag = (type, payload) => ({
  type,
  payload,
});

export const getItem = (id) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_ITEM, true));
    const item = await Api.getItem(id);

    await CacheOperations.saveItem(item);

    dispatch({
      type: GET_ITEM_SUCCESS,
      payload: item,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_GETTING_ITEM, false));
  }
};

export const getOwnItems = () => async (dispatch) => {
  try {
    const ownedItems = await Api.getOwnItems();

    await CacheOperations.saveItems(ownedItems);

    dispatch({
      type: GET_OWN_ITEMS_SUCCESS,
      payload: ownedItems,
    });
  } catch (e) {
    console.error(e);
  }
};

export const createItem = (props) => async (dispatch, getState) => {
  try {
    const to = getState().item.getIn(['item', 'id']);
    const newItem = await Api.postItem(props);
    if (!newItem) {
      return console.error('Error while creating a new item');
    }

    await CacheOperations.createItem({ item: newItem, to });

    return dispatch({
      type: CREATE_ITEM_SUCCESS,
      payload: newItem,
    });
  } catch (e) {
    return console.error(e);
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    await Api.deleteItem(id);

    await CacheOperations.deleteItem(id);

    dispatch({
      type: DELETE_ITEM_SUCCESS,
      payload: id,
    });
  } catch (e) {
    console.error(e);
  }
};

export const clearItem = () => (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ITEM_SUCCESS,
    });
  } catch (e) {
    console.error(e);
  }
};

export const moveItem = (payload) => async (dispatch, getState) => {
  try {
    await Api.moveItem(payload);
    // get current displayed item
    const from = getState().item.getIn(['item', 'id']);
    dispatch({
      type: MOVE_ITEM_SUCCESS,
      payload: { ...payload, from },
    });
  } catch (e) {
    console.error(e);
  }
};

export const copyItem = (payload) => async (dispatch) => {
  try {
    const newItem = await Api.copyItem(payload);
    dispatch({
      type: COPY_ITEM_SUCCESS,
      payload: { ...payload, item: newItem },
    });
  } catch (e) {
    console.error(e);
  }
};

export const getChildren = (id) => async (dispatch) => {
  try {
    const children = await Api.getChildren(id);
    dispatch({
      type: GET_CHILDREN_SUCCESS,
      payload: { id, children },
    });
  } catch (e) {
    console.error(e);
  }
};
