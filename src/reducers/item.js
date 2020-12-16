import { Map, List } from 'immutable';
import { ROOT_ID } from '../config/constants';
import {
  CREATE_ITEM_SUCCESS,
  SET_ITEM_SUCCESS,
  GET_OWN_ITEMS_SUCCESS,
  DELETE_ITEM_SUCCESS,
  CLEAR_ITEM_SUCCESS,
  GET_ITEM_SUCCESS,
} from '../types/item';
import { getParentsIdsFromPath } from '../utils/item';

const DEFAULT_ITEM = Map({
  id: ROOT_ID,
  parents: [],
  children: [],
});

const INITIAL_STATE = Map({
  item: DEFAULT_ITEM,
  items: List(), // items
  root: List(), // ids
});

const updateItems = (items, fetchedItems) => {
  let newItems = items;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of fetchedItems) {
    const idx = newItems.findIndex(({ id }) => item.id === id);
    // update existing element
    if (idx >= 0) {
      newItems = newItems.set(idx, item);
    } else {
      // add new elem
      newItems = newItems.push(item);
    }
  }
  return newItems;
};

const removeItemInItems = (items, id) => {
  let newItems = items;
  const item = items.find(({ id: thisId }) => id === thisId);

  // remove item with id and all its children
  newItems = items.filter(
    ({ id: thisId, parents = [], path }) =>
      id !== thisId &&
      !parents.includes(id) &&
      !getParentsIdsFromPath(path).includes(id),
  );
  // remove in direct parent's children
  const parentIds = getParentsIdsFromPath(item.path);
  if (parentIds.length > 1) {
    const directParentId = parentIds[parentIds.length - 2]; // get most direct parent
    const directParent = newItems.find(
      ({ id: thisId }) => thisId === directParentId,
    );
    if (directParent) {
      directParent.children = directParent.children?.filter(
        (child) => child !== id,
      );
    }
  }
  return newItems;
};

const addChildInItem = ({ items, id, to }) => {
  const newItems = items;
  const toIdx = newItems.findIndex(({ id: thisId }) => thisId === to);
  return newItems.updateIn([toIdx, 'children'], (children) => {
    if (children) {
      children.push(id);
      return children;
    }
    return null;
  }); // update only if was fetched once
};

const addItemInItems = (items, { to, item: newItem }) => {
  // add new item in items
  let newItems = items.push(newItem);

  // update to's children if not root
  if (to !== ROOT_ID) {
    newItems = addChildInItem({ items: newItems, id: newItem.id, to });
  }

  return newItems;
};

const updateRootItems = (items) => {
  const rootItems = items.filter(({ path }) => !path.includes('.'));
  return rootItems;
};

const updateState = (state) => {
  const items = state.get('items');

  // update root: own, shared, etc..
  let newState = state.updateIn(['root'], () => updateRootItems(items));

  // update current item if exists
  const currentId = newState.getIn(['item', 'id']);
  if (currentId) {
    newState = newState.set(
      'item',
      Map(items.find(({ id }) => currentId === id)),
    );
  }
  return newState;
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_ITEM_SUCCESS:
      return state.setIn(['item'], DEFAULT_ITEM);
    case GET_ITEM_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        updateItems(items, [payload]),
      );
      return updateState(newState);
    }
    case GET_OWN_ITEMS_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        updateItems(items, payload),
      );
      return updateState(newState);
    }
    case SET_ITEM_SUCCESS:
      return state
        .setIn(['item'], Map(payload.item))
        .updateIn(['items'], (items) =>
          updateItems(items, [
            payload.item,
            ...payload.parents,
            ...payload.children,
          ]),
        );
    case CREATE_ITEM_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        addItemInItems(items, payload),
      );
      return updateState(newState);
    }
    case DELETE_ITEM_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        removeItemInItems(items, payload),
      );
      return updateState(newState);
    }
    default:
      return state;
  }
};
