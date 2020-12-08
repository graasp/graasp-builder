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
  const parents = getParentsIdsFromPath(path).map((id) => {
    return API.getItem(id);
  });
  return Promise.all(parents);
};

export const setItem = (id) => async (dispatch, getState) => {
  const items = getState().item.get('items');

  // use saved item when possible
  const item =
    items.find(({ id: thisId }) => id === thisId) || (await API.getItem(id));
  const { children, parents } = item;
  let newChildren = [];
  if (!children) {
    newChildren = await API.getChildren(id);
    item.children = newChildren.map(({ id: childId }) => childId);
  }

  let newParents = [];
  if (!parents) {
    newParents = await buildParentsLine(item.path);
    item.parents = newParents.map(({ id: parentId }) => parentId);
  }
  dispatch({
    type: SET_ITEM_SUCCESS,
    payload: { item, parents: newParents, children: newChildren },
  });
};

export const getItem = (id) => async (dispatch) => {
  const item = await API.getItem(id);
  dispatch({
    type: GET_ITEM_SUCCESS,
    payload: item,
  });
};

export const getOwnItems = () => async (dispatch) => {
  const ownedItems = (await API.getOwnItems()) || sampleItems;
  dispatch({
    type: GET_OWN_ITEMS_SUCCESS,
    payload: ownedItems,
  });
};

export const createItem = (props) => async (dispatch) => {
  const newItem = await API.createItem(props);
  if (!newItem) {
    return console.error('Error while creating a new item');
  }
  return dispatch({
    type: CREATE_ITEM_SUCCESS,
    payload: newItem,
  });
};

export const deleteItem = (id) => async (dispatch) => {
  const deletedItem = await API.deleteItem(id);
  if (deletedItem.status === 404) {
    return console.error(`Couldn't delete item ${id}`);
  }
  return dispatch({
    type: DELETE_ITEM_SUCCESS,
    payload: id,
  });
};

export const clearItem = () => (dispatch) => {
  dispatch({
    type: CLEAR_ITEM_SUCCESS,
  });
};
