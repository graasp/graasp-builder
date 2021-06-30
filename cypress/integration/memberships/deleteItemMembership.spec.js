import { buildItemPath } from '../../../src/config/paths';
import {
  buildItemMembershipRowDeleteButtonId,
  ITEM_SETTINGS_BUTTON_CLASS,
} from '../../../src/config/selectors';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';

const deleteItemMembership = (id) => {
  cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();
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
    deleteItemMembership(mId);

    cy.wait('@deleteItemMembership').then(({ request: { url } }) => {
      expect(url).to.contain(mId);
    });
  });
});
