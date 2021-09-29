import { buildItemPath } from '../../../src/config/paths';
import {
  buildItemMembershipRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';

const deleteItemMembership = ({ id, itemId }) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();
  cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).click();
};

describe('Delete Membership', () => {
  it('delete item membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[0];
    cy.visit(buildItemPath(id));

    // share
    const { id: mId } = memberships[1];
    deleteItemMembership({ id: mId, itemId: id });

    cy.wait('@deleteItemMembership').then(({ request: { url } }) => {
      expect(url).to.contain(mId);
    });
  });
});
