import { CookieKeys, PackedFolderItemFactory } from '@graasp/sdk';

import {
  HOME_PATH,
  REDIRECT_PATH,
  buildItemPath,
} from '../../src/config/paths';
import { HEADER_APP_BAR_ID, ITEM_MAIN_CLASS } from '../../src/config/selectors';
import { REQUEST_FAILURE_LOADING_TIME } from '../support/constants';
import { SIGN_IN_PATH } from '../support/paths';

describe('Authentication', () => {
  describe('Signed Off > Redirect to sign in route', () => {
    beforeEach(() => {
      cy.setUpApi({ currentMember: null });
    });
    it('Home', () => {
      cy.visit(HOME_PATH);
      cy.url().should('include', SIGN_IN_PATH);
      cy.getCookie(CookieKeys.RedirectUrl, {
        timeout: REQUEST_FAILURE_LOADING_TIME,
      }).should('have.property', 'value', HOME_PATH);
    });
  });

  describe('Signed In', () => {
    const ENV = { items: [PackedFolderItemFactory()] };

    beforeEach(() => {
      cy.setUpApi(ENV);
    });

    describe('Load page correctly', () => {
      it('Home', () => {
        cy.visit(HOME_PATH);
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
      });
      it('Item', () => {
        cy.visit(buildItemPath(ENV.items[0].id));
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
        cy.get(`.${ITEM_MAIN_CLASS}`).should('exist');
      });
    });

    describe('Redirect to URL saved in cookie', () => {
      it('Home', () => {
        cy.setCookie(CookieKeys.RedirectUrl, HOME_PATH);
        cy.visit(REDIRECT_PATH);
        cy.url().should(
          'equal',
          new URL(HOME_PATH, Cypress.config().baseUrl).toString(),
        );
      });

      it('Item', () => {
        cy.setCookie(CookieKeys.RedirectUrl, buildItemPath(ENV.items[0].id));
        cy.visit(REDIRECT_PATH);
        cy.url().should(
          'equal',
          new URL(
            buildItemPath(ENV.items[0].id),
            Cypress.config().baseUrl,
          ).toString(),
        );
      });
    });
  });
});
