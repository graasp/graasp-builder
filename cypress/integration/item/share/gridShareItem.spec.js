import {
  ITEM_LAYOUT_MODES,
  PERMISSION_LEVELS,
} from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';

const shareItem = ({ id, member, permission }) => {
  cy.get(`#${buildItemCard(id)} .${SHARE_ITEM_BUTTON_CLASS}`).click();

  cy.fillShareModal({ member, permission });
};

describe('Share Item in Grid', () => {
  it('share item on Home', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // share
    const { id } = SAMPLE_ITEMS.items[0];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.WRITE });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemCard(id)}`).should('exist');
    });
  });

  it('share item in item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // share
    const { id } = SAMPLE_ITEMS.items[2];
    const member = MEMBERS.ANNA;
    shareItem({ id, member, permission: PERMISSION_LEVELS.READ });

    cy.wait('@shareItem').then(() => {
      cy.get(`#${buildItemCard(id)}`).should('exist');
    });
  });

  // todo : check item permission for users
});
