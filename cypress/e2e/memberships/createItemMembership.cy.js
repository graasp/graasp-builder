import { buildItemPath } from '../../../src/config/paths';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { PERMISSION_LEVELS } from '../../fixtures/enums';
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

    cy.wait('@postManyItemMemberships').then(
      ({
        request: {
          url,
          body: { memberships },
        },
      }) => {
        expect(url).to.contain(id);
        expect(memberships[0].permission).to.equal(permission);
        expect(memberships[0].memberId).to.equal(member.id);
      },
    );

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
