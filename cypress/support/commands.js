import _ from 'lodash';
import {
  mockCopyItem,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockPostItem,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    deleteItemError = false,
    postItemError = false,
    moveItemError = false,
    copyItemError = false,
    getItemError = false,
  } = {}) => {
    const cachedItems = _.cloneDeep(items);

    mockGetOwnItems(cachedItems);

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockGetItem(cachedItems, getItemError);

    mockGetChildren(cachedItems);

    mockMoveItem(cachedItems, moveItemError);

    mockCopyItem(cachedItems, copyItemError);
  },
);
