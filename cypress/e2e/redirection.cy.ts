import { PackedFolderItemFactory, saveUrlForRedirection } from '@graasp/sdk';

import { REDIRECT_PATH } from '../../src/config/paths';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '../../src/config/selectors';

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
    const items = [PackedFolderItemFactory()];
    cy.setUpApi({ items });

    cy.visit(REDIRECT_PATH);

    cy.get(`#${ACCESSIBLE_ITEMS_TABLE_ID}`).should('be.visible');
  });
});
