import { buildItemPath } from '../../../src/config/paths';
import {
  NAVIGATION_HOME_LINK_ID,
  buildItemCard,
} from '../../../src/config/selectors';

Cypress.Commands.add('goToItemInCard', (id) => {
  // card component might have many click zone
  cy.get(`#${buildItemCard(id)} a[href="${buildItemPath(id)}"]`)
    .first()
    .click();
});

Cypress.Commands.add('goToHome', () => {
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.get(`[href^="${buildItemPath(id)}"]`).click();
});
