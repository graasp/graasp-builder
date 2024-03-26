import { HOME_PATH } from '../../src/config/paths';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
} from '../../src/config/selectors';
import { SIGN_IN_PATH } from '../support/paths';

describe('Header', () => {
  it('App Navigation', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);
    // check navigation and display and interface doesn't crash
    // todo: this is less robust than using the Platform contant from ui, but it was making cypress compile ui which is unnecessary.
    cy.get(`#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.Builder}`).click();
    cy.get(`#${APP_NAVIGATION_PLATFORM_SWITCH_ID}`).should('exist');
  });

  describe('User Menu', () => {
    it('Sign out', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      // sign out
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}`).click();
      cy.url().should('include', SIGN_IN_PATH);
    });

    // it('Switch users', () => {
    //   cy.setUpApi({ storedSessions: MOCK_SESSIONS });
    //   cy.visit(HOME_PATH);
    //   cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();

    //   MOCK_SESSIONS.forEach(({ id }) => {
    //     cy.get(`#${buildMemberMenuItemId(id)}`).should('be.visible');
    //   });

    //   // switch to first user
    //   cy.get(`#${buildMemberMenuItemId(MOCK_SESSIONS[0].id)}`)
    //     .click()
    //     .then(() => {
    //       // session cookie should be different
    //       const currentCookie = getCurrentSession();
    //       expect(currentCookie).to.equal(MOCK_SESSIONS[0].token);
    //     });
    //   cy.get(`#${OWNED_ITEMS_ID}`).should('be.visible');
    // });
  });
});
