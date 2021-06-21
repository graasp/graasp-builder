import { buildItemPath } from '../../../../src/config/paths';
import {
  buildMemberAvatarClass,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { membershipsWithoutUser } from '../../../../src/utils/membership';
import { CURRENT_USER } from '../../../fixtures/members';
import { ITEMS_WITH_MEMBERSHIPS } from '../../../fixtures/memberships';

describe('View Memberships', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });
  });

  it('view membership in share item modal', () => {
    const [item] = ITEMS_WITH_MEMBERSHIPS.items;
    const { memberships } = item;
    cy.visit(buildItemPath(item.id));
    cy.get(`.${SHARE_ITEM_BUTTON_CLASS}`).click();

    const filteredMemberships = membershipsWithoutUser(
      memberships,
      CURRENT_USER.id,
    );

    // panel only contains 2 avatars: one user, one +x
    // check contains member avatar
    const [first, second] = filteredMemberships;
    cy.get(`.${buildMemberAvatarClass(first.memberId)}`).should('exist');
    cy.get(`.${buildMemberAvatarClass(second.memberId)}`).should('exist');

    // todo: check permission level
  });
});
