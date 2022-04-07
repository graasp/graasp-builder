import { HOME_PATH } from '../../src/config/paths';
import { APP_NAVIGATION_DROP_DOWN_ID } from '../../src/config/selectors';

describe('Header', () => {
  it('App Navigation', () => {
    // check navigation and display and interface doesn't crash
    cy.setUpApi();
    cy.visit(HOME_PATH);
    cy.get(`#${APP_NAVIGATION_DROP_DOWN_ID}`).click();
    cy.wait(3000);
    cy.get(`#${APP_NAVIGATION_DROP_DOWN_ID}`).should('exist');
  });
});
