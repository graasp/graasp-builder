import {
  ItemMembership,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildItemPath, buildItemSharePath } from '../../../src/config/paths';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildItemMembershipRowSelector,
  buildPermissionOptionId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';
import { ItemForTest } from '../../support/types';

const openPermissionSelect = (id: string) => {
  const select = cy.get(
    `${buildItemMembershipRowSelector(
      id,
    )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`,
  );
  select.click();
  return select;
};

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
  const select = openPermissionSelect(id);
  select.get(`#${buildPermissionOptionId(permission)}`).click();
};

describe('Edit Membership', () => {
  it('edit item membership', () => {
    cy.setUpApi(ITEMS_WITH_MEMBERSHIPS);

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

  it('cannot downgrade child membership', () => {
    const item: ItemForTest = PackedFolderItemFactory();
    const child: ItemForTest = PackedFolderItemFactory();
    const memberships = [
      {
        permission: PermissionLevel.Admin,
        member: CURRENT_USER,
        item: child,
      } as unknown as ItemMembership,
      {
        permission: PermissionLevel.Write,
        member: MEMBERS.BOB,
        item,
      } as unknown as ItemMembership,
    ];
    const items = [
      {
        ...child,
        memberships,
      },
    ];
    cy.setUpApi({ items });

    // go to children item
    cy.visit(buildItemSharePath(child.id));

    const m = memberships[1];
    openPermissionSelect(m.id);

    // should not show read
    cy.get(`#${buildPermissionOptionId(PermissionLevel.Read)}`).should(
      'not.exist',
    );
  });
});
