import { buildItemPath } from '../../../src/config/paths';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowSelector,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { membershipsWithoutUser } from '../../../src/utils/membership';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';
import {
  ITEMS_WITH_MEMBERSHIPS,
  ITEM_WITH_WRITE_ACCESS,
} from '../../fixtures/memberships';

describe('View Memberships', () => {
  beforeEach(() => {
    cy.setUpApi(ITEMS_WITH_MEMBERSHIPS);
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
    for (const { permission, member, id } of filteredMemberships) {
      const { name, email } = Object.values(MEMBERS).find(
        ({ id: mId }) => mId === member.id,
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

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }

    // todo: check permission level
  });
});

describe('View Memberships Read-Only Mode', () => {
  beforeEach(() => {
    cy.setUpApi({ ...ITEM_WITH_WRITE_ACCESS });
  });

  it('view membership in settings read-only mode', () => {
    const [item] = ITEM_WITH_WRITE_ACCESS.items;
    const { memberships } = item;
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    // check contains member avatar
    for (const { permission, member, id } of memberships) {
      const { name, email } = Object.values(MEMBERS).find(
        ({ id: mId }) => mId === member.id,
      );
      // check name, mail and permission
      cy.get(buildItemMembershipRowSelector(id))
        .should('contain', name)
        .should('contain', email)
        .should('contain', permission);

      // check no permission select component exists
      cy.get(
        `${buildItemMembershipRowSelector(
          id,
        )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS} input`,
      ).should('not.exist');

      // check no delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should(
        'not.exist',
      );
    }
  });
});
