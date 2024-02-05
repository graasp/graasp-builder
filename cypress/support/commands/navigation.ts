import { buildItemPath } from '../../../src/config/paths';
import {
  NAVIGATION_HOME_LINK_ID,
  buildItemLink,
  buildItemsTableRowIdAttribute,
} from '../../../src/config/selectors';

Cypress.Commands.add('goToItemInGrid', (id) => {
  cy.get(`#${buildItemLink(id)}`).click();
});

Cypress.Commands.add('goToItemInList', (id) => {
  cy.get(buildItemsTableRowIdAttribute(id)).click();
});

Cypress.Commands.add('goToHome', () => {
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.get(`[href="${buildItemPath(id)}"]`).click();
});
