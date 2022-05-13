import { PERMISSION_LEVELS } from '../../../src/enums';
import { buildItemPath } from '../../../src/config/paths';
import {
  buildShareButtonId,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
  CREATE_MEMBERSHIP_FORM_ID,
} from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { MEMBERS } from '../../fixtures/members';

const inviteItem = ({ id, email, permission, submit }) => {
  cy.get(`#${buildShareButtonId(id)}`).click();

  cy.fillShareForm({
    member: { email },
    permission,
    submit,
    selector: `#${CREATE_MEMBERSHIP_FORM_ID}`,
  });
};

describe('Create Invitation', () => {
  it('invite one new member', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // invite
    const email = 'mock@email.com';
    const permission = PERMISSION_LEVELS.READ;
    inviteItem({ id, email, permission });

    cy.wait('@postInvitations').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      const { invitations } = body;
      expect(invitations[0]?.permission).to.equal(permission);
      expect(invitations[0]?.email).to.equal(email);
    });

    // check that the email field is emptied after sharing completes
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).should('be.empty');
  });
  it('cannot invite member with membership', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to child item
    const { id } = SAMPLE_ITEMS.items[1];
    cy.visit(buildItemPath(id));

    // invite
    const { email } = MEMBERS.ANNA;
    const permission = PERMISSION_LEVELS.READ;
    inviteItem({ id, email, permission, submit: false });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });

  it('cannot invite with invalid data', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // invite
    const email = 'mock';
    const permission = PERMISSION_LEVELS.READ;
    inviteItem({ id, email, permission, submit: false });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });
});
