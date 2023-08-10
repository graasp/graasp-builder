import { PermissionLevel } from '@graasp/sdk';

import { buildItemPath } from '../../../src/config/paths';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildItemMembershipRowSelector,
  buildPermissionOptionId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';
import { TABLE_MEMBERSHIP_RENDER_TIME } from '../../support/constants';

const editItemMembership = ({
  itemId,
  id,
  permission,
}: {
  id: string;
  itemId: string;
  permission: PermissionLevel;
}) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();

  cy.wait(TABLE_MEMBERSHIP_RENDER_TIME);

  const select = cy.get(
    `${buildItemMembershipRowSelector(
      id,
    )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`,
  );
  select.click();
  select.get(`#${buildPermissionOptionId(permission)}`).click();
};

describe('Edit Membership', () => {
  it('edit item membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[0];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Read;
    const { id: mId } = memberships[1];
    editItemMembership({ itemId: id, id: mId, permission });

    cy.wait('@editItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(mId);
      expect(body?.permission).to.equal(permission);
    });
  });

  it('edit children membership should create a new membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[1];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Admin;
    const { id: mId } = memberships[1];
    editItemMembership({ itemId: id, id: mId, permission });

    cy.wait('@postItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      expect(body?.permission).to.equal(permission);
    });
  });
});
