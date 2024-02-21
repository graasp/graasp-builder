import { CookieKeys } from '@graasp/sdk';

import {
  HOME_PATH,
  ITEMS_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  HEADER_APP_BAR_ID,
  ITEM_MAIN_CLASS,
} from '../../src/config/selectors';
import { SAMPLE_ITEMS } from '../fixtures/items';
import {
  REDIRECTION_TIME,
  REQUEST_FAILURE_LOADING_TIME,
} from '../support/constants';
import { SIGN_IN_PATH } from '../support/paths';

describe('Authentication', () => {
  describe('Signed Off > Redirect to sign in route', () => {
    beforeEach(() => {
      cy.setUpApi({ ...SAMPLE_ITEMS, currentMember: null });
    });
    it('Home', () => {
      cy.visit(HOME_PATH);
      cy.url().should('equal', SIGN_IN_PATH);
      cy.getCookie(CookieKeys.RedirectUrl, {
        timeout: REQUEST_FAILURE_LOADING_TIME,
      }).should('have.property', 'value', HOME_PATH);
    });
    it('Shared Items', () => {
      cy.visit(SHARED_ITEMS_PATH);
      cy.url().should('equal', SIGN_IN_PATH);
      cy.getCookie(CookieKeys.RedirectUrl, {
        timeout: REQUEST_FAILURE_LOADING_TIME,
      }).should('have.property', 'value', SHARED_ITEMS_PATH);
    });
  });

  describe('Signed In', () => {
    beforeEach(() => {
      cy.setUpApi(SAMPLE_ITEMS);
    });

    describe('Load page correctly', () => {
      it('Home', () => {
        cy.visit(HOME_PATH);
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
      });
      it('Shared Items', () => {
        cy.visit(SHARED_ITEMS_PATH);
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
        cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
      });
      it('Item', () => {
        cy.visit(buildItemPath(SAMPLE_ITEMS.items?.[0].id));
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
        cy.get(`.${ITEM_MAIN_CLASS}`).should('exist');
      });
    });

    describe('Redirect to URL in local storage', () => {
      it('Home', () => {
        cy.setCookie(CookieKeys.RedirectUrl, HOME_PATH);
        cy.visit(REDIRECT_PATH);
        cy.url({
          timeout: REDIRECTION_TIME,
        }).should('include', HOME_PATH);
      });

      it('Items', () => {
        cy.setCookie(CookieKeys.RedirectUrl, ITEMS_PATH);
        cy.visit(REDIRECT_PATH);
        cy.url({
          timeout: REDIRECTION_TIME,
        }).should('include', ITEMS_PATH);
      });

      it('SharedItems', () => {
        cy.setCookie(CookieKeys.RedirectUrl, SHARED_ITEMS_PATH);
        cy.visit(REDIRECT_PATH);
        cy.url({
          timeout: REDIRECTION_TIME,
        }).should('include', SHARED_ITEMS_PATH);
      });

      it('Item', () => {
        cy.setCookie(
          CookieKeys.RedirectUrl,
          buildItemPath(SAMPLE_ITEMS.items?.[0].id),
        );
        cy.visit(REDIRECT_PATH);
        cy.url({ timeout: REDIRECTION_TIME }).should(
          'include',
          buildItemPath(SAMPLE_ITEMS.items?.[0].id),
        );
      });
    });
  });
});
