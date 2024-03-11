import { saveUrlForRedirection } from '@graasp/sdk';

import { REDIRECT_PATH } from '../../src/config/paths';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '../../src/config/selectors';
import { SAMPLE_ITEMS } from '../fixtures/items';

const DOMAIN = Cypress.env('VITE_GRAASP_DOMAIN');

describe('Redirection', () => {
  it('Redirection to saved url', () => {
    const link = 'https://graasp.org';
    saveUrlForRedirection(link, DOMAIN);

    cy.setUpApi();
    cy.visit(REDIRECT_PATH);

    cy.url().should('contain', link);
  });

  it('Redirection to home if no url is saved', () => {
    cy.setUpApi(SAMPLE_ITEMS);

    cy.visit(REDIRECT_PATH);

    cy.get(`#${ACCESSIBLE_ITEMS_TABLE_ID}`).should('be.visible');
  });
});
