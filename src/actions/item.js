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
  FLAG_GETTING_OWN_ITEMS,
  FLAG_CREATING_ITEM,
  FLAG_DELETING_ITEM,
  FLAG_GETTING_CHILDREN,
  GET_ITEMS_SUCCESS,
  FLAG_GETTING_ITEMS,
  FLAG_MOVING_ITEM,
  FLAG_COPYING_ITEM,
  EDIT_ITEM_SUCCESS,
  FLAG_SETTING_ITEM,
  FLAG_EDITING_ITEM,
  GET_SHARED_ITEMS_SUCCESS,
} from '../types/item';
import { getParentsIdsFromPath } from '../utils/item';
import { createFlag } from './utils';

// eslint-disable-next-line no-unused-vars
const buildParentsLine = (path) => {
  // get parents id without self
  const parentItems = getParentsIdsFromPath(path).slice(0, -1);
  const parents = parentItems.map((id) => Api.getItem(id));
  return Promise.all(parents);
};

export const setItem = (id) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_SETTING_ITEM, true));
    // use saved item when possible
    const item = await Api.getItem(id);

    const { children, parents } = item;
    let newChildren = [];
    if (!children) {
      newChildren = await Api.getChildren(id);
    }

    let newParents = [];
    if (!parents) {
      newParents = await buildParentsLine(item.path);
    }
    dispatch({
      type: SET_ITEM_SUCCESS,
      payload: { item, children: newChildren, parents: newParents },
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_SETTING_ITEM, false));
  }
};

export const getItem = (id) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_ITEM, true));
    const item = await Api.getItem(id);

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

export const getItems = () => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_ITEMS, true));

    const items = await Api.getItems();

    dispatch({
      type: GET_ITEMS_SUCCESS,
      payload: items,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_GETTING_ITEMS, false));
  }
};

export const getOwnItems = () => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_OWN_ITEMS, true));
    const ownedItems = await Api.getOwnItems();

    dispatch({
      type: GET_OWN_ITEMS_SUCCESS,
      payload: ownedItems,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_GETTING_OWN_ITEMS, false));
  }
};

export const createItem = (props) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_CREATING_ITEM, true));
    const newItem = await Api.postItem({ ...props });
    if (!newItem) {
      return console.error('Error while creating a new item');
    }

    return dispatch({
      type: CREATE_ITEM_SUCCESS,
      payload: newItem,
    });
  } catch (e) {
    return console.error(e);
  } finally {
    dispatch(createFlag(FLAG_CREATING_ITEM, false));
  }
};

export const deleteItem = (item) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_DELETING_ITEM, true));
    await Api.deleteItem(item.id);
    dispatch({
      type: DELETE_ITEM_SUCCESS,
      payload: item,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_DELETING_ITEM, false));
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
    dispatch(createFlag(FLAG_MOVING_ITEM, true));

    // get current displayed item
    const from = getState().item.getIn(['item', 'id']);
    await Api.moveItem({ ...payload, from });

    dispatch({
      type: MOVE_ITEM_SUCCESS,
      payload,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_MOVING_ITEM, false));
  }
};

export const copyItem = (payload) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_COPYING_ITEM, true));
    const newItem = await Api.copyItem(payload);

    dispatch({
      type: COPY_ITEM_SUCCESS,
      payload: { ...payload, item: newItem },
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_COPYING_ITEM, false));
  }
};

export const getChildren = (id) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_GETTING_CHILDREN, true));
    const children = await Api.getChildren(id);
    if (children.length) {
      // update items
      dispatch(getItems());
    }
    dispatch({
      type: GET_CHILDREN_SUCCESS,
      payload: { id, children },
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_GETTING_CHILDREN, false));
  }
};

export const editItem = (item) => async (dispatch) => {
  try {
    dispatch(createFlag(FLAG_EDITING_ITEM, true));
    const editedItem = await Api.editItem(item);
    dispatch({
      type: EDIT_ITEM_SUCCESS,
      payload: editedItem,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dispatch(createFlag(FLAG_EDITING_ITEM, false));
  }
};

export const getSharedItems = () => async (dispatch) => {
  try {
    const sharedItems = await Api.getSharedItems();

    let childrenItems = [];
    for (const item of sharedItems) {
      const { children, id } = item;
      // get children
      let newChildren = [];
      if (!children) {
        // eslint-disable-next-line no-await-in-loop
        newChildren = await Api.getChildren(id);
        childrenItems = childrenItems.concat(newChildren);
        item.children = newChildren.map(({ id: childId }) => childId);
      }
    }

    dispatch({
      type: GET_SHARED_ITEMS_SUCCESS,
      payload: [...sharedItems, ...childrenItems],
    });
  } catch (e) {
    console.error(e);
  }
};
