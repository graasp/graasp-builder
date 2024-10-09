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

    // show forbidden message
    cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('be.visible');

    // do not show request membership button
    cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('not.exist');
  });
});
