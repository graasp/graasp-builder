import {
  buildItemLink,
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../src/config/selectors';
import {
  mockCopyItem,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockPostItem,
  mockEditItem,
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
    editItemError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));

    mockGetOwnItems(cachedItems);

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockGetItem(cachedItems, getItemError);

    mockGetChildren(cachedItems);

    mockMoveItem(cachedItems, moveItemError);

    mockCopyItem(cachedItems, copyItemError);

    mockEditItem(cachedItems, editItemError);
  },
);

Cypress.Commands.add('goToItem', (id) => {
  cy.wait(500);
  cy.get(`#${buildItemLink(id)}`).click();
});

Cypress.Commands.add('goToHome', () => {
  cy.wait(500);
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.wait(500);
  cy.get(`#${buildNavigationLink(id)}`).click();
});
