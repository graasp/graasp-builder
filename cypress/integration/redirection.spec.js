import { saveUrlForRedirection } from '@graasp/utils';
import { REDIRECT_PATH } from '../../src/config/paths';
import { OWNED_ITEMS_ID } from '../../src/config/selectors';

describe('Redirection', () => {
  it('Redirection to saved url', () => {
    const link = 'http://somelink.com';
    saveUrlForRedirection(link);

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
