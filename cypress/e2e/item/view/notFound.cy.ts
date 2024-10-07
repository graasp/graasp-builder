import { v4 } from 'uuid';

import { buildItemPath } from '@/config/paths';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  REQUEST_MEMBERSHIP_BUTTON_ID,
} from '@/config/selectors';

describe('Item does not exist', () => {
  it('Show forbidden message and cannot request membership', () => {
    cy.setUpApi();
    cy.visit(buildItemPath(v4()));

    // no add button
    cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('be.visible');

    // menu item only contains flag
    cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('not.exist');
  });
});
