import * as API from '../api/item';
import {
  GET_NAVIGATION_SUCCESS,
  GET_CHILDREN_SUCCESS,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM_SUCCESS,
  GET_OWN_ITEMS_SUCCESS,
  GET_ITEM_SUCCESS,
  CLEAR_ITEM_SUCCESS,
} from '../types/item';
import sampleItems from '../data/sample';

const buildParentsLine = (path) => {
  const parents = path.split('.').map((id) => {
    const itemId = id.replaceAll('_', '-');
    return API.getItem(itemId);
  });
  return Promise.all(parents);
};

export const getItem = (id) => async (dispatch) => {
  const item = await API.getItem(id);
  const children = await API.getChildren(id);
  const parents = await buildParentsLine(item.path);
  dispatch({
    type: GET_ITEM_SUCCESS,
    payload: { item, parents, children },
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
  dispatch({
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

export const getChildren = (id) => async (dispatch) => {
  let children = [];
  if (!id) {
    children = await API.getOwnItems();
  }
  children = await API.getChildren(id);
  dispatch({
    type: GET_CHILDREN_SUCCESS,
    payload: children,
  });
};

export const getNavigation = (itemId) => async (dispatch) => {
  if (!itemId) {
    return [];
  }
  const navigation = await buildParentsLine(itemId);
  return dispatch({
    type: GET_NAVIGATION_SUCCESS,
    payload: navigation,
  });
};
