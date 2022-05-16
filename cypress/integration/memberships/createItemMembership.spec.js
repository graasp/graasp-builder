import { PERMISSION_LEVELS } from '../../../src/enums';
import { buildItemPath } from '../../../src/config/paths';
import {
  buildShareButtonId,
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { MEMBERS } from '../../fixtures/members';

const shareItem = ({ id, member, permission, submit }) => {
  cy.get(`#${buildShareButtonId(id)}`).click();

  cy.fillShareForm({
    member,
    permission,
    submit,
    selector: `#${CREATE_MEMBERSHIP_FORM_ID}`,
  });
};

describe('Create Membership', () => {
  it('share item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // share
    const member = MEMBERS.FANNY;
    const permission = PERMISSION_LEVELS.READ;
    shareItem({ id, member, permission });

    cy.wait('@postItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      expect(body?.permission).to.equal(permission);
      expect(body?.memberId).to.equal(member.id);
    });

    // check that the email field is emptied after sharing completes
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).should('be.empty');
  });

  it('cannot share item twice', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // fill
    const member = MEMBERS.ANNA;
    const permission = PERMISSION_LEVELS.READ;
    shareItem({ id, member, permission });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });

  it('cannot share item with invalid data', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // fill
    const permission = PERMISSION_LEVELS.READ;
    shareItem({ id, member: { email: 'wrong' }, permission });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });
});
