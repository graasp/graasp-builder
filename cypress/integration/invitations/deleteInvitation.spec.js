import { buildItemPath } from '../../../src/config/paths';
import {
  buildItemInvitationRowDeleteButtonId,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { TABLE_MEMBERSHIP_RENDER_TIME } from '../../support/constants';
import { ITEMS_WITH_INVITATIONS } from '../../fixtures/invitations';

const deleteInvitation = ({ id, itemId }) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();
  cy.wait(TABLE_MEMBERSHIP_RENDER_TIME);
  cy.get(`#${buildItemInvitationRowDeleteButtonId(id)}`).click();
};

describe('Delete Invitation', () => {
  it('delete invitation', () => {
    cy.setUpApi(ITEMS_WITH_INVITATIONS);

    // go to children item
    const { id, invitations } = ITEMS_WITH_INVITATIONS.items[1];
    cy.visit(buildItemPath(id));

    // delete
    const { id: mId } = invitations[2];
    deleteInvitation({ id: mId, itemId: id });

    cy.wait('@deleteInvitation').then(({ request: { url } }) => {
      expect(url).to.contain(mId);
    });
  });
  it('cannot delete invitation from parent', () => {
    cy.setUpApi(ITEMS_WITH_INVITATIONS);

    // go to children item
    const { id, invitations } = ITEMS_WITH_INVITATIONS.items[1];
    cy.visit(buildItemPath(id));
    cy.get(`#${buildShareButtonId(id)}`).click();

    const { id: mId } = invitations[1];
    cy.get(`#${buildItemInvitationRowDeleteButtonId(mId)}`).should(
      'be.disabled',
    );
  });
});
