import {
  buildItemPath,
  HOME_PATH,
  SHARED_ITEMS_PATH,
} from '../../src/config/paths';
import {
  HEADER_APP_BAR_ID,
  HEADER_USER_ID,
  ITEM_MAIN_CLASS,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../src/config/selectors';
import { SAMPLE_ITEMS } from '../fixtures/items';
import { CURRENT_USER } from '../fixtures/members';
import {
  REQUEST_FAILURE_LOADING_TIME,
  PAGE_LOAD_WAITING_PAUSE,
  REDIRECTION_CONTENT,
} from '../support/constants';

describe('Authentication', () => {
  describe('Signed Off > Redirect to sign in route', () => {
    beforeEach(() => {
      cy.setUpApi({ ...SAMPLE_ITEMS, getCurrentMemberError: true });
    });
    it('Home', () => {
      cy.visit(HOME_PATH);
      cy.wait(REQUEST_FAILURE_LOADING_TIME);
      cy.get('html').should('contain', REDIRECTION_CONTENT);
    });
    it('Shared Items', () => {
      cy.visit(SHARED_ITEMS_PATH);
      cy.wait(REQUEST_FAILURE_LOADING_TIME);
      cy.get('html').should('contain', REDIRECTION_CONTENT);
    });
  });

  describe('Signed In', () => {
    beforeEach(() => {
      cy.setUpApi(SAMPLE_ITEMS);
    });

    it('Signing Off redirect to sign in route', () => {
      cy.visit(HOME_PATH);
      // user name in header
      cy.get(`#${HEADER_USER_ID}`).click();
      cy.get(`#${USER_MENU_SIGN_OUT_OPTION_ID}`).click();
      cy.wait(REQUEST_FAILURE_LOADING_TIME);
      cy.get('html').should('contain', REDIRECTION_CONTENT);
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
  });
});
