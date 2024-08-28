import { PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';
import { ITEM_LOGIN_SCREEN_FORBIDDEN_ID } from '@/config/selectors';

it('User is logged out and item is private', () => {
  const item = PackedFolderItemFactory({}, { permission: null });
  cy.setUpApi({
    items: [item],
    currentMember: null,
  });

  cy.visit(buildItemPath(item.id));

  cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('be.visible');
});
