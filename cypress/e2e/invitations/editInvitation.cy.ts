import { PermissionLevel } from '@graasp/sdk';

import { buildItemPath } from '../../../src/config/paths';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildInvitationTableRowSelector,
  buildPermissionOptionId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { ITEMS_WITH_INVITATIONS } from '../../fixtures/invitations';

const editInvitation = ({ itemId, id, permission }) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();
  const select = cy.get(
    `${buildInvitationTableRowSelector(
      id,
    )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`,
  );
  select.click();
  select.get(`#${buildPermissionOptionId(permission)}`).click();
};

describe('Edit Invitation', () => {
  it('edit item invitation', () => {
    cy.setUpApi(ITEMS_WITH_INVITATIONS);

    // go to children item
    const { id, invitations } = ITEMS_WITH_INVITATIONS.items[1];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Read;
    const { id: iId } = invitations[1];
    editInvitation({ itemId: id, id: iId, permission });

    cy.wait('@patchInvitation').then(({ request: { url, body } }) => {
      expect(url).to.contain(iId);
      expect(body?.permission).to.equal(permission);
    });
  });

  it('edit parent invitation from children should create a new membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_INVITATIONS });

    // go to children item
    const { id, invitations } = ITEMS_WITH_INVITATIONS.items[1];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Admin;
    const { id: iId } = invitations[0];
    editInvitation({ itemId: id, id: iId, permission });

    cy.wait('@postInvitations').then(({ request: { url, body } }) => {
      const {
        invitations: [invitation],
      } = body;

      expect(url).to.contain(id);
      expect(invitation?.permission).to.equal(permission);
    });
  });
});
