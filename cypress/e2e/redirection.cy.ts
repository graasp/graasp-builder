import { saveUrlForRedirection } from '@graasp/sdk';

import { REDIRECT_PATH } from '../../src/config/paths';
import { OWNED_ITEMS_ID } from '../../src/config/selectors';

const DOMAIN = Cypress.env('REACT_APP_GRAASP_DOMAIN');

describe('Redirection', () => {
  it('Redirection to saved url', () => {
    const link = 'https://graasp.org';
    saveUrlForRedirection(link, DOMAIN);

    cy.setUpApi();
    cy.visit(REDIRECT_PATH);

    cy.url().should('contain', link);
  });

  it('Redirection to home if no url is saved', () => {
    cy.setUpApi();

    cy.visit(REDIRECT_PATH);

    cy.get(`#${OWNED_ITEMS_ID}`).should('be.visible');
  });
});
