import { PERMISSION_LEVELS } from '../../../src/enums';
import { buildItemPath } from '../../../src/config/paths';
import { buildShareButtonId } from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { MEMBERS } from '../../fixtures/members';

const shareItem = ({ member, permission, id }) => {
  cy.get(`#${buildShareButtonId(id)}`).click();

  cy.fillShareForm({ member, permission });
};

describe('Create Membership', () => {
  it('share item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // share
    const member = MEMBERS.ANNA;
    const permission = PERMISSION_LEVELS.READ;
    shareItem({ id, member, permission });

    cy.wait('@shareItem').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      expect(body?.permission).to.equal(permission);
      expect(body?.memberId).to.equal(member.id);
    });
  });
});
