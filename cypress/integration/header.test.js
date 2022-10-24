import { getCurrentSession } from '@graasp/sdk';

import { SIGN_IN_PATH } from '../../src/config/constants';
import { HOME_PATH } from '../../src/config/paths';
import {
  APP_NAVIGATION_DROP_DOWN_ID,
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  MEMBER_PROFILE_MEMBER_NAME_ID,
  OWNED_ITEMS_ID,
  buildMemberMenuItemId,
} from '../../src/config/selectors';
import { MOCK_SESSIONS } from '../fixtures/members';
import { PAGE_LOAD_WAITING_PAUSE } from '../support/constants';

describe('Header', () => {
  it('App Navigation', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);
    // check navigation and display and interface doesn't crash
    cy.get(`#${APP_NAVIGATION_DROP_DOWN_ID}`).click();
    cy.wait(3000);
    cy.get(`#${APP_NAVIGATION_DROP_DOWN_ID}`).should('exist');
  });

  describe('User Menu', () => {
    it('Standalone actions', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      // go to profile
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}`).click();
      cy.get(`#${MEMBER_PROFILE_MEMBER_NAME_ID}`).should('be.visible');

      // sign in as another user
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}`).click();
      cy.url().should('equal', SIGN_IN_PATH);
    });

    it('Sign out', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      // sign out
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}`).click();
      cy.url().should('equal', SIGN_IN_PATH);
    });

    it('Switch users', () => {
      cy.setUpApi({ storedSessions: MOCK_SESSIONS });
      cy.visit(HOME_PATH);
      cy.wait(PAGE_LOAD_WAITING_PAUSE);
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();

      MOCK_SESSIONS.forEach(({ id }) => {
        cy.get(`#${buildMemberMenuItemId(id)}`).should('be.visible');
      });

      // switch to first user
      cy.get(`#${buildMemberMenuItemId(MOCK_SESSIONS[0].id)}`)
        .click()
        .then(() => {
          // session cookie should be different
          const currentCookie = getCurrentSession();
          expect(currentCookie).to.equal(MOCK_SESSIONS[0].token);
        });
      cy.get(`#${OWNED_ITEMS_ID}`).should('be.visible');
    });
  });
});
