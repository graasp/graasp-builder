import {
  buildItemLink,
  buildItemsTableRowIdAttribute,
  buildNavigationLink,
  NAVIGATION_HIDDEN_PARENTS_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../../src/config/selectors';
import { NAVIGATE_PAUSE, WAIT_FOR_ITEM_TABLE_ROW_TIME } from '../constants';

Cypress.Commands.add('goToItemInGrid', (id) => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`#${buildItemLink(id)}`).click();
});

Cypress.Commands.add('goToItemInList', (id) => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(buildItemsTableRowIdAttribute(id), {
    timeout: WAIT_FOR_ITEM_TABLE_ROW_TIME,
  }).click();
});

Cypress.Commands.add('goToHome', () => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id, openHidden = false) => {
  cy.wait(NAVIGATE_PAUSE);
  if (openHidden) {
    cy.get(`#${NAVIGATION_HIDDEN_PARENTS_ID}`).click();
  }
  cy.get(`#${buildNavigationLink(id)}`).click();
});
