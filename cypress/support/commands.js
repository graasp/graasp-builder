import {
  buildItemLink,
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../src/config/selectors';
import { NAVIGATE_PAUSE } from './constants';
import {
  mockCopyItem,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockPostItem,
  mockEditItem,
  mockShareItem,
  mockGetMember,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    members = [],
    deleteItemError = false,
    postItemError = false,
    moveItemError = false,
    copyItemError = false,
    getItemError = false,
    editItemError = false,
    shareItemError = false,
    getMemberError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));

    mockGetOwnItems(cachedItems);

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockGetItem(cachedItems, getItemError);

    mockGetChildren(cachedItems);

    mockMoveItem(cachedItems, moveItemError);

    mockCopyItem(cachedItems, copyItemError);

    mockEditItem(cachedItems, editItemError);

    mockShareItem(cachedItems, shareItemError);

    mockGetMember(cachedMembers, getMemberError);
  },
);

Cypress.Commands.add('goToItem', (id) => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`#${buildItemLink(id)}`).click();
});

Cypress.Commands.add('goToHome', () => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`#${buildNavigationLink(id)}`).click();
});
