import { buildItemPath } from '../../../src/config/paths';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildItemMembershipRowSelector,
  buildMemberAvatarClass,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { membershipsWithoutUser } from '../../../src/utils/membership';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';

describe('View Memberships', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });
  });

  it('view membership in share item modal', () => {
    const [item] = ITEMS_WITH_MEMBERSHIPS.items;
    const { memberships } = item;
    cy.visit(buildItemPath(item.id));
    cy.openMetadataPanel();

    const filteredMemberships = membershipsWithoutUser(
      memberships,
      CURRENT_USER.id,
    );

    // panel only contains 2 avatars: one user, one +x
    // check contains member avatar
    const [first, second] = filteredMemberships;
    cy.get(`.${buildMemberAvatarClass(first.memberId)}`).should('be.visible');
    cy.get(`.${buildMemberAvatarClass(second.memberId)}`).should('be.visible');

    // todo: check permission level
  });

  it('view membership in settings', () => {
    const [item] = ITEMS_WITH_MEMBERSHIPS.items;
    const { memberships } = item;
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    const filteredMemberships = membershipsWithoutUser(
      memberships,
      CURRENT_USER.id,
    );

    // panel only contains 2 avatars: one user, one +x
    // check contains member avatar
    for (const { permission, memberId, id } of filteredMemberships) {
      const { name, email } = Object.values(MEMBERS).find(
        ({ id: mId }) => mId === memberId,
      );
      // check name and mail
      cy.get(buildItemMembershipRowSelector(id))
        .should('contain', name)
        .should('contain', email);

      // check permission select
      cy.get(
        `${buildItemMembershipRowSelector(
          id,
        )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS} input`,
      ).should('have.value', permission);
    }

    // todo: check permission level
  });
});
