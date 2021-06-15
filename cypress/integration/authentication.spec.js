import {
  buildItemPath,
  HOME_PATH,
  ITEMS_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
} from '../../src/config/paths';
import {
  HEADER_APP_BAR_ID,
  HEADER_USER_ID,
  ITEM_MAIN_CLASS,
  REDIRECTION_CONTENT_ID,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../src/config/selectors';
import { SAMPLE_ITEMS } from '../fixtures/items';
import { CURRENT_USER } from '../fixtures/members';
import {
  REQUEST_FAILURE_LOADING_TIME,
  PAGE_LOAD_WAITING_PAUSE,
  REDIRECTION_TIME,
} from '../support/constants';
import { REDIRECT_URL_LOCAL_STORAGE_KEY } from '../../src/config/constants';

describe('Authentication', () => {
  describe('Signed Off > Redirect to sign in route', () => {
    beforeEach(() => {
      cy.setUpApi({ ...SAMPLE_ITEMS, getCurrentMemberError: true });
    });
    it('Home', () => {
      cy.visit(HOME_PATH);
      cy.wait(REQUEST_FAILURE_LOADING_TIME);
      cy.getLocalStorage(REDIRECT_URL_LOCAL_STORAGE_KEY).should(
        'equal',
        HOME_PATH,
      );
      cy.get(`#${REDIRECTION_CONTENT_ID}`).should('exist');
    });
    it('Shared Items', () => {
      cy.visit(SHARED_ITEMS_PATH);
      cy.wait(REQUEST_FAILURE_LOADING_TIME);
      cy.getLocalStorage(REDIRECT_URL_LOCAL_STORAGE_KEY).should(
        'equal',
        SHARED_ITEMS_PATH,
      );
      cy.get(`#${REDIRECTION_CONTENT_ID}`).should('exist');
    });
  });

  describe('Signed In', () => {
    beforeEach(() => {
      cy.setUpApi(SAMPLE_ITEMS);
    });

    it('Signing Off redirect to sign in route', () => {
      cy.visit(HOME_PATH);
      cy.get(`#${HEADER_USER_ID}`).click();
      cy.get(`#${USER_MENU_SIGN_OUT_OPTION_ID}`).click();
      cy.wait(REQUEST_FAILURE_LOADING_TIME);

      // should refetch current member just after signing out
      // this current member will be unauthorized and thus redirect
      cy.wait(['@signOut', '@getCurrentMember']);
    });

    describe('Load page correctly', () => {
      it('Home', () => {
        cy.visit(HOME_PATH);
        cy.wait(PAGE_LOAD_WAITING_PAUSE);
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
      });
      it('Shared Items', () => {
        cy.visit(SHARED_ITEMS_PATH);
        cy.wait(PAGE_LOAD_WAITING_PAUSE);
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
      });
      it('Item', () => {
        cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));
        cy.get(`#${HEADER_APP_BAR_ID}`).should('exist');
        cy.get(`.${ITEM_MAIN_CLASS}`).should('exist');
      });
    });

    describe('Display User Information', () => {
      it('Header', () => {
        cy.visit(HOME_PATH);
        // user name in header
        cy.get(`#${HEADER_USER_ID}`).should('contain', CURRENT_USER.name);
      });
    });

    describe('Redirect to URL in local storage', () => {
      it('Home', () => {
        cy.setLocalStorage(REDIRECT_URL_LOCAL_STORAGE_KEY, HOME_PATH);
        cy.visit(REDIRECT_PATH);
        cy.wait(REDIRECTION_TIME);
        cy.url().should('include', HOME_PATH);
      });

      it('Items', () => {
        cy.setLocalStorage(REDIRECT_URL_LOCAL_STORAGE_KEY, ITEMS_PATH);
        cy.visit(REDIRECT_PATH);
        cy.wait(REDIRECTION_TIME);
        cy.url().should('include', ITEMS_PATH);
      });

      it('SharedItems', () => {
        cy.setLocalStorage(REDIRECT_URL_LOCAL_STORAGE_KEY, SHARED_ITEMS_PATH);
        cy.visit(REDIRECT_PATH);
        cy.wait(REDIRECTION_TIME);
        cy.url().should('include', SHARED_ITEMS_PATH);
      });

      it('Item', () => {
        cy.setLocalStorage(
          REDIRECT_URL_LOCAL_STORAGE_KEY,
          buildItemPath(SAMPLE_ITEMS.items[0].id),
        );
        cy.visit(REDIRECT_PATH);
        cy.wait(REDIRECTION_TIME);
        cy.url().should('include', buildItemPath(SAMPLE_ITEMS.items[0].id));
      });
    });
  });
});
