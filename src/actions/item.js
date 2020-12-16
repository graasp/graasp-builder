import * as Api from '../api/item';
import {
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM_SUCCESS,
  GET_OWN_ITEMS_SUCCESS,
  SET_ITEM_SUCCESS,
  CLEAR_ITEM_SUCCESS,
  GET_ITEM_SUCCESS,
} from '../types/item';
import sampleItems from '../data/sample';
import { getParentsIdsFromPath } from '../utils/item';
import { getCachedItem } from '../config/cache';

const buildParentsLine = (path) => {
  // get parents id without self
  const parentItems = getParentsIdsFromPath(path).slice(0, -1);
  const parents = parentItems.map((id) => Api.getItem(id));
  return Promise.all(parents);
};

export const setItem = (id) => async (dispatch, getState) => {
  try {
    const item = getCachedItem(getState, id) || (await Api.getItem(id));

    // use saved item when possible
    const { children, parents } = item;

    // get children
    let newChildren = [];
    if (!children) {
      newChildren = await Api.getChildren(id);
      item.children = newChildren.map(({ id: childId }) => childId);
    }

    // get parents
    let newParents = [];
    if (!parents) {
      newParents = await buildParentsLine(item.path);
      item.parents = newParents.map(({ id: parentId }) => parentId);
    }

    dispatch({
      type: SET_ITEM_SUCCESS,
      payload: { item, parents: newParents, children: newChildren },
    });
  } catch (e) {
    console.error(e);
  }
};

export const getItem = (id) => async (dispatch) => {
  try {
    const item = await Api.getItem(id);
    dispatch({
      type: GET_ITEM_SUCCESS,
      payload: item,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getOwnItems = () => async (dispatch) => {
  try {
    const ownedItems = (await Api.getOwnItems()) || sampleItems;
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
    return dispatch({
      type: CREATE_ITEM_SUCCESS,
      payload: { to, item: newItem },
    });
  } catch (e) {
    return console.error(e);
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    await Api.deleteItem(id);
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
