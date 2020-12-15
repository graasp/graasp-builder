import * as API from '../api/item';
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

const buildParentsLine = (path) => {
  // get parents id without self
  const parentItems = getParentsIdsFromPath(path).slice(0, -1);
  const parents = parentItems.map((id) => {
    return API.getItem(id);
  });
  return Promise.all(parents);
};

export const setItem = (id) => async (dispatch, getState) => {
  try {
    const items = getState().item.get('items');

    // use saved item when possible
    const item =
      items.find(({ id: thisId }) => id === thisId) || (await API.getItem(id));
    const { children, parents } = item;

    // get children
    let newChildren = [];
    if (!children) {
      newChildren = await API.getChildren(id);
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
    const item = await API.getItem(id);
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
    const ownedItems = (await API.getOwnItems()) || sampleItems;
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
    const newItem = await API.createItem(props);
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
    await API.deleteItem(id);
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
