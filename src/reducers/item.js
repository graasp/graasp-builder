import { Map, List } from 'immutable';
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
  parents: List(), // ids
  children: List(), // ids
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

const updateRootItems = (items) => {
  return items.filter(({ path }) => !path.includes('.'));
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_ITEM_SUCCESS:
      return state.setIn(['item'], DEFAULT_ITEM);
    case GET_ITEM_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        updateItems(items, [payload]),
      );
      return newState.updateIn(['root'], () =>
        updateRootItems(newState.get('items')),
      );
    }
    case GET_OWN_ITEMS_SUCCESS: {
      const newState = state.updateIn(['items'], (items) =>
        updateItems(items, payload),
      );
      return newState.updateIn(['root'], () =>
        updateRootItems(newState.get('items')),
      );
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
      const newState = state
        .updateIn(['item', 'children'], (children) => {
          children.push(payload.id);
          return children;
        })
        .updateIn(['items'], (items) => updateItems(items, [payload]));
      return newState.updateIn(['root'], () =>
        updateRootItems(newState.get('items')),
      );
    }
    case DELETE_ITEM_SUCCESS: {
      const newState = state
        .updateIn(['item', 'children'], (children) =>
          children.filter((id) => id !== payload),
        )
        .updateIn(['items'], (items) => removeItemInItems(items, payload));
      return newState.updateIn(['root'], () =>
        updateRootItems(newState.get('items')),
      );
    }
    default:
      return state;
  }
};
