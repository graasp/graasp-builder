import {
  ItemMembership,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildItemPath } from '../../../src/config/paths';
import {
  CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID,
  buildItemMembershipRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';
import { TABLE_MEMBERSHIP_RENDER_TIME } from '../../support/constants';
import { ItemForTest } from '../../support/types';

const deleteItemMembership = ({
  id,
  itemId,
}: {
  id: string;
  itemId: string;
}) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();
  cy.wait(TABLE_MEMBERSHIP_RENDER_TIME);
  cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).click();
  cy.get(`#${CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID}`).click();
};

describe('Delete Membership', () => {
  it('delete item membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[0];
    cy.visit(buildItemPath(id));

    // delete
    const { id: mId } = memberships[1];
    deleteItemMembership({ id: mId, itemId: id });

    cy.wait('@deleteItemMembership').then(({ request: { url } }) => {
      expect(url).to.contain(mId);
    });
  });

  it('cannot delete item membership from parent', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[1];
    cy.visit(buildItemPath(id));
    cy.get(`#${buildShareButtonId(id)}`).click();

    const { id: mId } = memberships[1];
    cy.get(`#${buildItemMembershipRowDeleteButtonId(mId)}`).should(
      'be.disabled',
    );
  });

  it('cannot delete if there is only one admin item membership', () => {
    const item: ItemForTest = PackedFolderItemFactory();
    const items = [
      {
        ...item,
        memberships: [
          {
            permission: PermissionLevel.Admin,
            member: CURRENT_USER,
            item,
          } as unknown as ItemMembership,
          {
            permission: PermissionLevel.Read,
            member: MEMBERS.BOB,
            item,
          } as unknown as ItemMembership,
        ],
      },
    ];

    cy.setUpApi({ items });
    // go to children item
    const { id, memberships } = items[0];
    cy.visit(buildItemPath(id));
    cy.get(`#${buildShareButtonId(id)}`).click();

    const { id: mId } = memberships[1];
    cy.get(`#${buildItemMembershipRowDeleteButtonId(mId)}`).should(
      'be.disabled',
    );
  });
});
