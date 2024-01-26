import { buildItemPath } from '../../../src/config/paths';
import {
  NAVIGATION_HOME_LINK_ID,
  buildItemLink,
  buildItemsTableRowIdAttribute,
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

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.wait(NAVIGATE_PAUSE);
  cy.get(`[href="${buildItemPath(id)}"]`).click();
});
